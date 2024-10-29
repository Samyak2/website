---
title: "How is sound represented in code?"
draft: true
summary: "Representation of audio as data."
date: 2024-08-11
slug: "audio"
tags:
- music
- audio
---



First, a disclaimer. I'm not a musician. I do not have any formal training in music. But I do have an interest in it and have been learning the guitar for a few months. So I could be wrong about music-related concepts. Feel free to correct me on those.

<!-- As I was writing this article, the concepts seemed too obvious to me. But that was definitely not the case before I learnt of them. I'm sure there's a name for this phenomenon. -->

# What is sound anyway?

You might have learnt about sound as *waves* traveling through air. Air repeatedly gets compressed and expanded. Our ears perceive that as sound.

<img alt="a GIF of waves traveling through the air towards the right. The waves are created by a pistol compressing the air from the left." src="http://blog.soton.ac.uk/soundwaves/files/2013/12/longituddots1.gif" style="max-width: 100%;" />

Another way to look at sound is *vibration*. When moving air hits the eardrum, it makes the drum vibrate and (oversimplifying it a lot) we perceive that as sound. It moves back and forth slightly from its resting position.

<img alt="a GIF of a membrane vibrating" src="https://chem.libretexts.org/@api/deki/files/54917/imageedit_1_8987729393.gif?revision=2" style="max-width: 100%;" />

## Frequencies

Both the waves and the vibrations happen very quickly. Humans can generally {{% sidenote "hear 20Hz to 20,000Hz." %}} Those numbers are an ideal range. As we age, that range reduces a lot. If you're above 50, that range goes up to only 8000 or 12000Hz. [^1] {{%/ sidenote %}} 1 Hertz (written as 1Hz) is one back and forth movement in one second. Imagine something vibrating 20,000 times a second!

Music (western) generally ranges from 30Hz to around 4200Hz.

Low frequency sounds deep and thick. This is called low pitch. High frequency sounds thin and sharp. This is high pitch.

{{< sidenote "Here are two example sounds from a piano." >}}
However note (hehe) that a note on an instrument doesn't just consist of a single frequency.
{{</ sidenote >}}

<!-- A2: https://www.apronus.com/static/pno0x3-pianosounds/pno045.mp3 -->
<!-- A5: https://www.apronus.com/static/pno0x3-pianosounds/pno081.mp3 -->

<figure style="margin: 10px">
<figcaption>Low pitch (note A2):</figcaption><audio controls src="https://github.com/fuhton/piano-mp3/raw/refs/heads/master/piano-mp3/A2.mp3"></audio>
</figure>

<figure style="margin: 10px">
<figcaption>High pitch (note A6):</figcaption><audio controls src="https://github.com/fuhton/piano-mp3/raw/refs/heads/master/piano-mp3/A6.mp3"></audio>
</figure>

# How do we represent sound as data?

Now that we know that sound is just waves, let's look at the simplest wave. The *sine* wave.

TODO: something about amplitude and frequency.

TODO: another graph with sliders for amplitude and frequency.

### Into a digital world

A wave is, by definition, *analog*. But in code, we only deal with the digital. The 1s and 0s. One way to go from analog to digital is by *sampling*. That is, checking the value at a regular interval and recording it. The regular interval is called the *sampling rate*.
Sampling never perfectly represents the source wave. =

Here's a sine wave and a sampling of it represented by dots. We can try reconstructing it by connecting the dots. As we expect, the reconstructed wave becomes more and more accurate as we increase the sampling rate. With a high enough sample rate, the sample is close enough to the original.

{{% includeHtmlFile "/assets/07_audio/graphs.html" %}}

### Are we data yet?

Okay, so we now have the audio as a bunch of points on a graph. To represent a point as data, we simply take its x and y-coordinates. In this case, the y-axis is time and the x is amplitude.
So audio data is just a series of: $$[(t_1, a_1), (t_2, a_2), ..., (t_n, a_n)]$$

Here is some of the data from the above chart, showing the sampled points.

{{% includeHtmlFile "/assets/07_audio/points1.html" %}}

### An optimization

You can notice a pattern in the data above. The points are always at a regular interval. So the x-values are always a multiple of some number. There are "sampling rate" number of points in one second of data. So the distance between a data point and the next is `1/(sampling rate)` seconds.

This is true even in real-world audio data. We can assume that the data points (the amplitudes) are always sampled at the correct interval. This means we can drop the x-values entirely. Those values can be recreated entirely using the sampling rate. So audio data now is just an array of numbers!

{{% includeHtmlFile "/assets/07_audio/points2.html" %}}

Now we know that audio data can be specified using two things:
1. The sampling rate. The unit for this is usually Hertz (Hz) or Kilohertz (kHz).
2. The amplitude of the audio at regular intervals. It's just a list/an array of numbers.

## Images - a parallel

Let us look at something that is a little bit easier to see as data. An image. Here's an example of a simple black & white (also called grayscale) image:

![An image of a plane. Top view. An old airplane, might be a toy](/images/plane.png)

The resolution of this image is 256 pixels by 256 pixels. Totalling 65,536 pixels.
Each pixel is represented by a number. 0 (the minimum value) is black and {{% sidenote "255 (the maximum value) is white." %}}This depends on the [bit depth](https://en.wikipedia.org/wiki/Color_depth) of the image. The example image uses 8-bit color, hence the range of 0-255.{{%/ sidenote %}}
So to represent an image, all we need is the resolution (height, width) and bunch of numbers. In this case, an array of 65,536 numbers.

An image can be seen as a 2-d matrix - numbers arranged in rows and columns:

$$
\begin{Bmatrix}
104 & 102 & ... & 112 & 113 \\\
\vdots & \vdots & \ddots & \vdots & \vdots\\\
203 & 188 & ... & 179 & 172
\end{Bmatrix}
$$

Color images are similar. Instead of one matrix, you have three separate ones for {{% sidenote "red, green and blue." %}}RGB is only one of many [color models](https://en.wikipedia.org/wiki/Color_model).{{%/ sidenote %}} Or you can see each value in the matrix as a tuple of three values (r, g, b).


## Back to audio

That digression into image as data probably raises more questions than it answers. Such as: What's the range of numbers in audio data? What's the *all black* and *all white* of audio?

The sine wave we saw earlier will give us some hint into the range of values. Unlike images, audio data can be negative too. The zero value is the resting position of the drum or the string. The vibration happens in both directions, hence the positive and negative values.

The actual range depends on the sample's [bit depth](https://en.wikipedia.org/wiki/Audio_bit_depth). 16-bit audio, for example, has values in the range -32,768 to +32,767. When processing audio, the data is usually {{% sidenote "converted to floating point and sometimes normalized to the range of -1.0 to 1.0." %}}Why? I'm not sure. It may be related to the fact that audio processing usually involves a lot of addition and multiplcation. With integers, you would need to handle overflows and underflows.{{%/ sidenote %}}



<!-- https://en.wikibooks.org/wiki/A-level_Computing/AQA/Paper_2/Fundamentals_of_data_representation/Sounds -->

<!-- TODO: what is digital vs analog -->
<!-- TODO: people know how images are represented in code. 0 is black, 255 is white. similar for rgb. draw parallels to audio. -->
<!-- TODO: music is a painting in time -->
<!-- TODO: next steps/further reading. what can we do with audio data? processing, etc. -->

[^1]: Source: [Patterns of hearing changes in women and men from denarians to nonagenarians](https://www.sciencedirect.com/science/article/pii/S2666606521000407) by Wasano et al.
