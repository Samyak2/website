---
title: "Mob Programming and Rust"
date: 2022-05-29T16:30:31+0530
draft: false
slug: "mob"
summary: "Have you ever wanted to just think about what needs to be done and the code for it automagically gets written? Well, I have. In its ideal form, this is what pair/mob programming would do — the navigator(s) simply think about and express their idea of what needs to happen and the driver magically gets it done. In the real world though, this does not happen."
tags:
 - rust
 - Mob Programming
---

# What is it?

I see Mob Programming as an extension to [Pair Programming](https://en.wikipedia.org/wiki/Pair_programming) where two people work on the same code on the same computer — one *drives* the keyboard while the other *navigates* the driver. A *mob* is when you have three or more people working this way, each taking their turn to be the driver while the others navigate.

Have you ever wanted to just think about what needs to be done and the code for it automagically gets written? [^1] Well, I have. In its ideal form, this is what pair/mob programming would do — navigator(s) simply think about and express their idea of what needs to happen and the driver magically gets it done.
In the real world though, this does not happen. The driver may have other ideas, the navigator(s)' idea may not make sense, the driver may not (yet!) know how to do what the navigator needs and all the other problems that come with communication between humans.
What ends up happening is a lot of discussion, a lot of learning, a lot of teaching and all in all, good times.

# But why?

If that was not enough to convince you, here's some other reasons how Mob Programming helps:
- All of the code is written with *everyone* present, including reviewers. There's no need to wait for a code review and all the back-and-forth that comes with it.
- This tweet by Dawn captures what I wanted to say here:
{{< twitterdark >}}
<p lang="en" dir="ltr">It&#39;s a nudist activity. How each member operates their terminal, editor, VCS, WM... is in the open. How each thinks is all but exposed. If you&#39;re willing to go through with it you&#39;ll learn so much. Come as you are. Let it all hang out. Metaphorically. <a href="https://twitter.com/hashtag/mobprogramming?src=hash&amp;ref_src=twsrc%5Etfw">#mobprogramming</a> <a href="https://twitter.com/hashtag/moborblob?src=hash&amp;ref_src=twsrc%5Etfw">#moborblob</a></p>&mdash; Shahar Dawn Or (@mightyiam) <a href="https://twitter.com/mightyiam/status/1522906956452679680?ref_src=twsrc%5Etfw">May 7, 2022</a>
{{< /twitterdark >}}
- The work that is produced is of a higher quality than what a single person could do. It's a combined product of the experiences of everyone in the mob.
- You won't use a hacky solution or a workaround unless everyone agrees that that is the best way to do it.
- If it's a side project or something else that you do in your free time, doing it together with a mob really gives you motivation. You look forward to doing it everyday with the mob. For me personally, mob programming was the only time I did something (almost) everyday, consistently for months [^5].


# It's Mobbin' time [^3]

I have been a part of a mob for a few months now. At [Mobus Operandi](https://github.com/mobusoperandi) [^2], I'm a part of Mob Otter that works on [michie](https://github.com/mobusoperandi/michie) — a Rust macro that adds memoization to any function. I started when I knew nothing about Rust macros and when I was a beginner in Rust. I learnt a lot about Rust (declarative macros, procedural macros, `static`, generics, traits, `Any`, `Once` and a lot more), Git, Shell/bash, Nix and non-technical things like communication/collaboration, teaching and learning [^4].

Thank you [Dawn](https://twitter.com/mightyiam) for inviting me to Mobus Operandi and thank you to everyone in Mob Otter for helping me grow <3.

# It may not be for everyone

While I think mobbing is great, not everyone will like it and it may not fit in certain organizations.

It also depends on your particular mob. Having one person who is significantly more advanced in the domain than the others may lead to that person being bored and not getting much out of it. On the other hand, having one person who is relatively new to the domain may lead to them slowing the mob down and they may feel insecure about it (our friend, the imposter syndrome, also does not help here). To alleviate this, Mobus Operandi has separate mobs for beginner, intermediate and advanced Rust programmers. That being said, mobs are all about learning. Do not hesitate to join mobs that are working on things you haven't touched before. After all, you are not doing it alone and your mob will always be with you to help you learn!

Mob programming may not be a good fit for organizations where individual responsibility is encouraged, where not more than 2 people are working on a thing at a time and where moving quickly and efficiently is the top priority. It could be seen as a waste of time to have 3-5 people in the team on a single call for a couple of hours when each person is working on separate components.

Mobbing also requires a certain level of commitment. For example, a mob that runs on weekdays for 2 hours each day means a commitment of 10 hours every week. Though this is small enough to be done along with a day job, it's a matter of personal choice.

# Where to go from here

Consider joining [Mobus Operandi](https://github.com/mobusoperandi/) if you want to learn Rust in a remote mob programming format.

Dawn had a [nice discussion](https://youtu.be/nxNDo-7Fyfk) with the folks at the [Mob Mentality Show](https://www.youtube.com/channel/UCgt1lVMrdwlZKBaerxxp2iQ) about Mobus Operandi, Rust, mob for hire and teal organizations.

[Here's](https://youtu.be/28S4CVkYhWA) a talk on mob programming by Woody Zuill who popularized the concept.

---

This what I think of mob programming. I realize that this reads like an appreciation post xD. [Reach out to me](/about#reach-out-to-me-at) if you have any thoughts.

Side note: my appreciation for mob programming has nothing to do with the fact that the character in my profile picture (on my website, GitHub, Twitter, etc.) is nicknamed Mob :)

Acknowledgements: Thank you, *Sathvik Srinivas*, for proofreading and suggesting improvements to this post.

[^1]: We don't talk about Copilot here.
[^2]: BTW this is such a great name :o
[^3]: Did you know that in the highest-grossing superhero movie of all time, *Morbius*, the title character, *Morbius*, does not actually say "It's *Morbin* time" because it would not fit the character *Morbius* whose actual name is Dr. *Morbius*[?](https://knowyourmeme.com/memes/its-morbin-time)
[^4]: As a small (and easy to explain) example, I used to skip straight to the answer section on stackoverflow. I learnt that it's useful to skim through the question to see if it's really what I need.
[^5]: This does not include things that have a clear incentive, such as school/university or job.
