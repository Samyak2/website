---
title: "An interactive exploration of McLeod's Pitch Detection Method"
summary: "A Pluto.jl notebook implementing the 2005 paper titled \"A Smarter Way To Find Pitch\" by Philip McLeod et al."
date: 2026-01-17
slug: "mcleod"
tags:
- julia
- audio
- music
---

In the 2005 paper titled ["A Smarter Way To Find Pitch"](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=60dd4c01f687858a5fbf6c021920c56247bcf2db#page=1.74) by Philip McLeod et al., the authors describe a new algorithm to detect pitch from an audio signal. This was named the **McLeod Pitch Method (MPM)**. This could be used to build, for example, a guitar tuner app.

I have attempted to implement the algorithm one step at a time, in an interactive [Pluto.jl](https://plutojl.org/) notebook. At every step, I plot the outputs and explore various inputs to better understand the fundamentals. The notebook is deployed at the link below. If the server is up, you can even interact with it (move the sliders, etc.). If not, you still get a static version of it.

[Live link](https://mcleod.samyak.me/)

[Source code](https://github.com/Samyak2/mcleod-pitch-detection)

**Disclaimer**: I come with no background in signal processing or audio programming. This is my attempt at understanding these concepts. I welcome any feedback. Please open an issue or reach out to me directly.

## But why?

The paper is a little light on the details of some specific functions and algorithms. Some things are hand-waved away. For example, the notebook includes:

- A visual exploration of differences between ACF Type I and II, SDF Type I and II, and NSDF. In particular, this helped me see how NSDF "normalizes" the SDF.
- An explanation of how Power Spectral Density comes into the picture and how it's calculated.
- A derivation (thanks to Pluto.jl's LaTeX support) of `m(𝜏)` given `m(𝜏 - 1)`. This is hand-waved away in the paper -- described in one big sentence light on details.
- Details on parabolic interpolation, along with a visualization of it.

<img alt="A screenshot of a part of the notebook showing MPM in action. It shows a plot of a line graph of a sound wave with some portion highlighted. At the top, there's text showing the actual frequency and the frequency detected by MPM." src="/images/mcleod.png" style="max-width: 100%;" />

## How do I use this?

I recommend reading the paper and attempting to implement it yourself. You can use this notebook as a reference if you do. Julia is a great language for implementing papers - you can write formulas almost one-to-one with only a few changes. Pluto.jl makes it even better by providing an interactive environment, LaTeX support (so you can derive equations right next to the function itself) and built-in package management.

The notebook can also be read like a blog post, so please take a look!
