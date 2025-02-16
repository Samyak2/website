---
title: Portfolio
custom_scss: ["/sass/portfolio.scss"]
---

## Publications

### Analysis of Garbage Collection Patterns to Extend Microbenchmarks for Big Data Workloads (2022) {#garbage-collection}

{{<smalltag>}}
Peer reviewed
{{</smalltag>}}

{{<smalltag>}}
Conference
{{</smalltag>}}

Built an open source tool to analyze garbage collection in the JVM at an object-level granularity.

📜 Paper: [Available on ACM Digital Library](https://dl.acm.org/doi/10.1145/3491204.3527473) (or [PDF](https://research.spec.org/icpe_proceedings/2022/companion/p121.pdf))

💾 Code: [GitHub](https://github.com/metonymic-smokey/JavaGC)

📺 Presentation: [WOSP-C at ACM ICPE 2022](https://youtu.be/qLKYqfniUII?t=8637) (starts at `2:23:57`)

### CapStyle - Stylized Image Captioning using Deep Learning Models (2019) {#capstyle}

📜 Paper: [PDF](/papers/capstyle.pdf), [Google Scholar](https://scholar.google.com/citations?view_op=view_citation&hl=en&user=aF5ofCgAAAAJ&citation_for_view=aF5ofCgAAAAJ:u-x6o8ySG0sC)

### Par-a-graph: Parallelising PageRank (2021) {#par-a-graph}

{{<smalltag>}}
Conference
{{</smalltag>}}

📜 Paper: [PDF](/papers/par-a-graph.pdf)

💾 Code: [GitHub](https://github.com/metonymic-smokey/par-a-graph)

📺 Presentation: [IEEE CCEM 2021 Student Project Showcase](https://youtu.be/Xl2a8j3zats)

### Architecting and Deploying Optimized GANs with minimal footprint for Fashion Synthesis (2021) {#optimized-gans}

{{<smalltag>}}
Conference
{{</smalltag>}}

📜 Paper: [PDF](/papers/optimized-gans.pdf)

💻 Live Demo: [GANs running entirely in your browser](https://fashion.samyak.me/)

📺 Presentation: [STCAI 2021](https://youtu.be/mHeglPANT7c?t=73)

### Pre-Training Reformer Language Models for Abstractive Summarisation (2020) {#reformer}

📜 Paper: [PDF](/papers/reformer2020.pdf)

## Open Source Work

### [browser-history](https://github.com/browser-history/browser-history)

- Python library to extract history (and more) from various browsers on various platforms.
- I started this with the purpose of introducing open-source to my peers in the university. I wanted people to contribute meaningfully to an actual project, beyond just a spelling fix. It was more than successful in achieving that goal.
- Got over 25 contributors from many different countries. Some were first time contributors.
- Participated in PyCon India 2020 and 2021 DevSprints, again helping people make their first open-source contributions.

### [michie](https://github.com/mobusoperandi/michie)

- A Rust attribute macro library that adds memoization to a function.
- Co-authored in a mob programming fashion.

### [toipe](https://github.com/Samyak2/toipe)

- A terminal-based typing test app written in Rust.

### Miscellaneous contributions

- [limbo](https://github.com/tursodatabase/limbo/pulls?q=is:pr+author:Samyak2) (SQLite re-write in rust)
- [salvo](https://github.com/salvo-rs/salvo/pulls?q=+is:pr+author:Samyak2) (Rust web framework)
- [pest.vim](https://github.com/pest-parser/pest.vim/pulls?q=is:pr+author:Samyak2) (vim support for pest parser)

## Work Projects

A few interesting projects I was involved in at my workplaces.

### Snowflake SQL query optimizer

- Analyzed top SQL queries of multiple Fortune 500 companies to provide recommendations for cost/performance optimization.
- Semi-automated using an existing SQL parser.
- **Place**: Chaos Genius
- **Involvement**: fully owned the project.
- **Impact**: a significant part of the product.

### Snowflake warehouse optimizer

- Built a rule-based optimizer for Snowflake Virtual Warehouses.
- Provides recommendations to reduce cost and maximize usage of warehouses.
- **Place**: Chaos Genius
- **Involvement**: fully owned the project.
- **Impact**: a significant part of the product.

### Chaos Genius open-source analytics tool

- https://github.com/chaos-genius/chaos_genius
- **Place**: Chaos Genius
- **Involvement**: top-committer, managed releases.
- **Impact**: this used to be the main product of the company.

### Incremental scanning of SaaS applications

- Built a system to incrementally scan files in Google Drive, OneDrive, etc.
- **Place**: Normalyze
- **Involvement**: fully owned the project.
- **Impact**: a core part of the product.

### Custom workflow system

- Built a queue-based workflow system.
- Generic system but built for processing a large amount of items as a single task.
- **Place**: Normalyze
- **Involvement**: co-owned the project.
- **Impact**: a core part of the product.
