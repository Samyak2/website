---
title: "Cancellation in async rust"
date: 2026-04-11
draft: false
summary: "My talk at Rust India Conference 2026 on cancellation in async rust"
slug: "cancel"
tags:
 - rust
---

# Cancellation in async rust

At [Rust India Conference 2026](https://hasgeek.com/rustbangalore/rust-india-conference-2026/).

## Recording

TODO

## Slides

[Google Slides](https://docs.google.com/presentation/d/1ElL-RlkB6l-kvyzjndeRIXKvW34DqghUqI_uKu_maK0/edit?usp=sharing)

## Reach out to us

- Presenter: [me](https://https://samyak.me) ([GitHub](https://github.com/Samyak2), [LinkedIn](https://www.linkedin.com/in/samyaks/))
- Special thanks to the team: [Amit](https://notashes.me/), [Aayush](https://naikaayush.com/), [Nimalan](https://www.linkedin.com/in/nimalan-mahadevan-52286411b/), [Faiz](https://www.linkedin.com/in/faiz-kothari/) and [Fenil](https://www.linkedin.com/in/fenil-k-jain/) for reviewing the content.

## Resources

- [Never snooze a future - Jack O'Connor](https://jacko.io/snooze.html)
- [Cancelling async rust by Rain](https://sunshowers.io/posts/cancelling-async-rust/) or [Oxide RFD 400](https://rfd.shared.oxide.computer/rfd/400)
- [Using Rust async for Query Execution and Cancelling Long-Running Queries - DataFusion Team](https://datafusion.apache.org/blog/2025/06/30/cancellation/)
- [Tokio blog post introducing task budgets](https://tokio.rs/blog/2020-04-preemption) and [`tokio::task::coop` docs](https://docs.rs/tokio/latest/tokio/task/coop/index.html).
- TODO: Andrew Lamb's talk on using tokio for CPU heavy tasks for DataFusion.
- [Deadlocking a tokio mutex without holding a lock](https://www.e6data.com/blog/deadlocking-tokio-mutex-without-holding-lock)
- [Oxide RFD 609 - Futurelock](https://rfd.shared.oxide.computer/rfd/0609)
