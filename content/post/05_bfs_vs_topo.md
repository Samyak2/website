---
title: "Turns out that BFS is not the same as topological sort"
summary: "Graph algorithms explained through interactive visualizations"
date: 2023-07-22
slug: "bfs-topo"
tags:
- algo
- graphs
---

{{< rawhtml >}}
<script src="https://cdn.jsdelivr.net/npm/cytoscape@3.25.0/dist/cytoscape.min.js"></script>
{{< /rawhtml >}}

The title may seem very obvious to people who know graph algorithms. Unfortunately, I'm not one of them.

## The problem

This is about implementing a **dependency graph**. Think of a project's npm/pip/maven/cargo dependencies. Or a data pipeline with SQL tables depending on each other.

Here is the problem that needed to be solved.
Given a project or a table (a "node") in the tree, how do I get all the other nodes that *depend* on it (the *dependents*)?
In other words, if I change the given node/project/table, which other nodes will I need to recompile/recreate?
The graph is structured specifically to help with this. Given a node, we know the *direct* dependents. So we just need to follow this trail to get all the dependents. The hard part here is getting the nodes in the right order. The right order is one where all dependencies of a node are "visited" before the node itself.

At the time, it seemed that a simple breadth-first search will give me all the nodes in order. Let's see how.

## Breadth-first search (BFS)

In this graph search algorithm, we visit all the neighbours of the node in an arbitrary order. Let's consider the direct neighbours as the first level and the neighbours of the neighbours as the second level and so on. BFS will visit all nodes on the first level before visiting all nodes on the second level and so on.

Here's a visualization of BFS on a graph of project dependencies. The edges indicate dependents, i.e., `pest` depends on `serde_json`, etc.
Feel free to pause and explore the order in which nodes are visited. You can click on a node to start BFS from that node.

{{% includeHtmlFile "/assets/05_bfs_vs_topo/common.html" %}}
{{% includeHtmlFile "/assets/05_bfs_vs_topo/bfs-graph.html" %}}

## Topological sort

A topological sorting is an ordering of the nodes of the graph where a node is visited only after all nodes that connect to that node are visited.
On a dependency graph, this is exactly the order we need.

There are many different algorithms to arrive at a topological ordering. Also, a graph can have more than one valid topological ordering.

Here's a visualization of one such topological sorting algorithm[^1] on a graph of project dependencies. The edges indicate dependents, i.e., `pest` depends on `serde_json`, etc.
Feel free to pause and explore the order in which nodes are visited. You can click on a node to start topological sort on that node.
Note that we are not performing topological sort on the whole graph but only the *subgraph* that is accessible from the selected node.

{{% includeHtmlFile "/assets/05_bfs_vs_topo/topo-graph.html" %}}

## BFS vs Topological sort - where do they differ?

As we see from the simulations above, when we perform BFS and topological sort starting with the node `ryu`, we get the same path (or ordering) in both cases.

So it can seem like BFS, which is much simpler to implement, works when you actually need a topological ordering. Depending on your graph, it may even work for all nodes in your graph. But of course, BFS makes no guarantees that all dependencies will be completed before visiting a node. It just happened to work for that particular graph or that particular node.

<!-- With graph algorithms especially, it's important to test your algorithms on graphs beyond your use case. Things may *look* right but will fail in unexpected ways. -->

Let's see an example of this. Click on the `quote` node on the graphs above. Or use this button to do so.

{{% includeHtmlFile "/assets/05_bfs_vs_topo/demo-button-1.html" %}}

The order in which BFS visits the nodes is obviously wrong! It visits `thiserror` before `syn`. That is equivalent to compiling a package before all of its dependencies are compiled. The topological sort is correct, because by definition, it needs to visit all the dependencies before visiting a node.

Some of the other nodes in the example graph show this behavior too. For example, `serde` and `proc-macro2`. So why did I use BFS for this use case in the first place?

## When are they the same?

In some cases though, you can get BFS to give you the same ordering of nodes that a full fledged topological sort can. Since BFS is much easier to implement, it can be a good choice.

Here's an example graph that shows this behavior. This is simple BFS, but it visits the nodes in the correct order.

{{% includeHtmlFile "/assets/05_bfs_vs_topo/bfs-graph-3.html" %}}

The requirement for this behavior is that all the nodes must be connected to only their *direct dependents*. If any node is connected to both a node and a connection of that node, BFS will not work.

## Conclusion

Comparing BFS and Topological sort is like comparing an apple and a bicycle. Sometimes, you don't need to go out to a restaurant when an apple in the fridge will do.

That is to say, in some cases BFS will do what you need without having to implement topological sort.

Thank you for reading!

## Further reading

- [The original stackoverflow answer that prompted this post](https://stackoverflow.com/a/62969342/11199009)
- [Using BFS *for* topological sort - stackoverflow](https://stackoverflow.com/a/44986459)
- [Other algorithms for topological sorting - Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting#Algorithms)

Acknowledgements: Thank you, *Sathvik Srinivas*, for proofreading and suggesting improvements to this post.

[^1]: [Kahn's algorithm](https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm) but only on the subgraph accessible from the selected node.
