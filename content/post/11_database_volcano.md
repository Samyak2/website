---
title: "Why the volcano model doesn't work"
summary: "The volcano model of implementing databases has been popular for a long time. These are my notes on where it stops working and why we need a better abstraction."
date: 2026-09-27
slug: "volcano"
tags:
- database
- perf
draft: true
---

The [Volcano model](https://paperhub.s3.amazonaws.com/dace52a42c07f7f8348b08dc2b186061.pdf) [^1] in databases has been very popular since it was introduced in 1994. For the purposes of this article, I do not mean the exact interface of "open(), next(), close()". I'm using the term much more loosely. Volcano model is one where the execution of a query is split into *operators* organized into a tree, which we call the *query plan*. Something like:

```
    Join
   /    \
Scan    Aggregate
           \
          Scan
```

With this definition, we can see that it's used in pretty much every database that exists today. PostgreSQL, MySQL, Clickhouse, Snowflake, Spark and many many others.

I'm arguing in this post that this model is broken. All it does is gives the user of the database a nice tree to look at. Beyond that, it's not very helpful. I'm not selling an alternative - I have none. Another disclaimer - I work on analytics query engines, so my experience with the internals of transactional databases is limited.

I hope that this helps people revisit this model - can we do better? I don't have the answer. Just questions.

Let's look at some things that the model is supposed to help us with.

## 1. Model of execution

Just by looking at the plan of a query, we can guess *how* it executes. Things like whether it used an index, which tables were joined first (*join order*), where a filter was applied, etc.

Unfortunately, a guess is all it is. Here's a few examples where this doesn't work.

### Joins

Joins usually run their child operators in a specific sequence. For example, a *hash join* runs the *build* side completely first and then starts the *probe* side. The query plan doesn't really show this unless you *know* that a hash join executes this way [^2].

### Pipeline breakers

The Volcano model is also sometimes called the *iterator* model. Rows (tuples?) flow up through the operator tree. Again, this breaks down quickly. There are operators which *block* this "pipeline" of data flowing through. They are sometimes referred to as *pipeline breakers*.

One example is aggregations. An aggregate cannot (usually) emit data unless it has fully consumed the input. The flow stops here and resumes once the aggregation is complete [^3].

A similar thing happens in joins, specifically the build side of a hash join. The build side blocks until it has read all its input.

### Dynamic filters

Dynamic filtering, or "sideways information passing", is a common optimization in databases. The idea is to use runtime information to filter out rows being read as and when we learn more information about the data. Here's a [great blog from DataFusion folks](https://datafusion.apache.org/blog/2025/09/10/dynamic-filters/) on dynamic filters.

Consider a join query like:
```sql
select *
from sales
  join calendar on sales.date_id = calendar.date_id
where calendar.year = '2020' and calendar.month = 'January';
```
There is no filter on the larger table `sales` (say, a few billion rows), but there is one on the smaller `calendar` table (maybe a few thousand rows). In the absence of indexes, this would mean that we will have to read the full `sales` table.

With dynamic filters, we instead construct a filter at runtime, that looks roughly like
```
sales.date_id in (1001, 1002, 1003, ...[+329 others])
```
These are the `date_id` values that we scanned from the `calendar` table. This could also be a bloom filter. The point is that we push a filter based on runtime values, to reduce the amount of data scanned.

Now, let's add another table to the join:
```sql
select *
from sales
  join promotions on sales.date_id = promotions.date_id
  join calendar on sales.date_id = calendar.date_id
where calendar.year = '2020' and calendar.month = 'January';
```

This would look something like:
```
            Join
          /      \
         /        \
        /          \
Scan(calendar)      Join
                  /      \
                 /        \
                /          \
      Scan(promotions)    Scan(sales)
```

Here, `calendar` and `promotions` are the build sides of the join and `sales` is the probe side. This means that `calendar` and `promotions` have to complete before `sales` starts. But what about the scheduling of `calendar` and `promotions` themselves? Can they be parallelized?

We could scan `calendar` first, use the `date_id` values from there to filter the `promotions` table and then filter out `sales`. Now there's a dependency of `calendar -> promotions -> sales` that's not reflected at all in the operator tree!

## 2. Code organization

Volcano also gives a nice abstraction for code. Each operator is self-contained. Something like the unix philosophy - each operator does one thing, but does it well.

You should know by now that this also breaks down. Some examples follow.

### Pushdowns

There is a class of optimizations that I collectively call *pushdowns*. Examples include filter pushdown, limit pushdown and aggregate pushdown. Let's try and understand them.

With filter pushdown, the idea is to do filtering of data as early as possible. This can be something like using an index (or parquet stats) to scan as few rows as possible before a large join or aggregation. Something like, going from:

```
Filter: "age > 30"
  \
  Scan (all rows)
```

To:

```
Scan: filter="age > 30"
```

The filter is "pushed down" to the scan. The scan operator can then be smart about it instead of reading all rows and then filtering later [^4].

Limit pushdown is something similar, where if you have something like `LIMIT 10` in your query, the scan can then prepare just enough work to fulfill the limit.

Aggregate pushdown is a more niche optimization. It can be useful when you have something like `max(age) FROM ...`, especially in analytics databases. Parquet files store stats like minimums and maximums in the *footer* (like a metadata for the file). Which means that the scan can skip reading the whole file and read just the footer!

With everything pushed down, the scan operator becomes quite complex. It's doing a lot more than just "scanning" the data. You might as well have an operator like this lol [^5]:
```
DoQuery: filter="age > 30", limit=10, agg=max(income)
```

### Dynamic filters

As we saw earlier, dynamic filters add a filter to a scan at runtime. There needs to be some synchronization between the join operator and the scan operator. They are no longer independent operators.

You could come up with a fairly clean and generic API for this. For example, DataFusion's [`DynamicFilterPhysicalExpr`](https://docs.rs/datafusion/55.1.0/datafusion/physical_expr/expressions/struct.DynamicFilterPhysicalExpr.html). Sadly, this still does not hide the fact that there is some shared mutable state between the two. This matters for things like [serialization](https://github.com/datafusion-contrib/datafusion-distributed/issues/180) where you can no longer independently serialize/deserialize the two operators -- you need to connect the dynamic filters on deserialization.

## 3. Perf interface for users

The operator tree provides a natural interface to show performance characteristics of a query. This is usually exposed through an `EXPLAIN ANALYZE`. The tree with the metrics give an indication of where a query's execution time is being spent. This provides actionable insights to a user. For example, a table scan taking most of the execution time could indicate the need for more/better filters.

The perf interface is one thing that I don't have anything negative to say about. Having said that, any alternate abstraction should be able to show the perf characteristics too - although with an unfamiliar format.

## Conclusion

Those were my points on why the volcano model doesn't work very well. It's a very loaded abstraction and breaks down even in common query shapes.

If you, the reader, have seen or thought of any alternatives, I would like to hear about them!

Acknowledgements: Thank you, *Sathvik Srinivas*, for proofreading and suggesting improvements to this post.

[^1]: Goetz Graefe, the author of the Volcano paper, has been involved in a bunch of cool database projects including Microsoft SQL Server, Google Napa (data warehouse) and Google F1 Lightning (HTAP system).
[^2]: [DataFusion code example](https://github.com/apache/datafusion/blob/871058cd7302ef8fa746e52329992408bc9c6c7e/datafusion/physical-plan/src/joins/hash_join/exec.rs#L1761). We can see that the `HashJoinExec` operator internally does this scheduling and synchronization.
[^3]: [DataFusion code example](https://github.com/apache/datafusion/blob/871058cd7302ef8fa746e52329992408bc9c6c7e/datafusion/physical-plan/src/aggregates/grouped_hash_stream.rs#L1333). We can see that the `AggregateExec` operator typically emits rows only once the input is done. "Typically" because there are exceptions that can be seen in the file.
[^4]: In data lake query engines (or lakehouse query engines), the scan can filter out things at multiple levels: skip entire partitions (partition pruning) using the partitioning info of the table, skip entire files using stats from the table format (Delta, Iceberg, etc.) and skip *row groups* within a parquet file using footer stats. All of this can be done before a filter operator above the scan sees any rows.
[^5]: Just look at the [complexity](https://github.com/apache/datafusion/blob/871058cd7302ef8fa746e52329992408bc9c6c7e/datafusion/datasource/src/file_scan_config/mod.rs#L153) [involved](https://github.com/apache/datafusion/blob/871058cd7302ef8fa746e52329992408bc9c6c7e/datafusion/datasource-parquet/src/source.rs#L271-L290) in DataFusion's data source code. Most of this is essential complexity - they have done a great job of creating good abstractions.
