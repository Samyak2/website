## Original images

- [sound_wave.gif](https://blog.soton.ac.uk/soundwaves/files/2013/12/longituddots1.gif) (6.8MB)
- [drum_vibration.gif](https://chem.libretexts.org/@api/deki/files/54917/imageedit_1_8987729393.gif?revision=2) (0.5MB)

## GIF optimization

Reduce colors, reduce resolution and select only half the frames (since the wave repeats for the second half). Final file size:  1.8MB.

```bash
gifsicle -i sound_wave.gif -O3 --colors 16 --resize-width 500 -o sound_wave_opt.gif "#0-75"
```

Reduce colors. Final file size: 171KB.
```bash
gifsicle -i drum_vibration.gif -O3 --colors 16 -o drum_vibration_opt.gif
```
