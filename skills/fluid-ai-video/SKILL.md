---
name: fluid-ai-video
description: Combines AI-generated video (Sora, Veo, Runway, Kling and similar) with Fluid brand motion - writes generation prompts that leave room for the brand, records the Fluid layer, and composites the two with ffmpeg. Use when someone wants motion graphics, a logo reveal or brand animation on top of, before or after an AI-made video.
---

# Fluid over AI video

AI video tools are good at footage and bad at logos and text: they warp letters and invent marks. So the footage comes from the AI, and everything that must be exact (logo, words, interface) comes from Fluid, recorded frame by frame and laid on top.

## 1. Plan the cut with the person

Agree on three things before generating anything:

- **Where the brand appears:** an opening (logo reveal), a middle beat (word changes), an ending (logo wipe), or all three.
- **The format:** vertical 9:16 for stories and reels, 4:5 for feed posts, 16:9 for sites and YouTube.
- **The length** of each part, in seconds.

## 2. Prompt the footage with room for the brand

Ask the generator for footage that leaves space, holds still where the brand comes in, and contains no text or logos of its own. Template:

> [Shot type] of [subject and action], [setting], [light and colour palette matching the brand: e.g. soft daylight, pale blue and black]. Locked-off camera for the first [n] seconds, then [movement]. The centre of the frame stays clear and uncluttered for [n] seconds. No text, no captions, no logos, no watermarks. [9:16 vertical | 4:5 | 16:9], [24 | 30] fps, [n] seconds.

Ready patterns:

- **Logo reveal over texture:** "Macro shot of [material related to the brand] moving slowly, shallow depth of field, [brand colours], locked-off camera, empty centre, no text."
- **Product in place:** "[Product] on a plain [colour] surface, slow push-in, soft shadows, clean background on the [left|right] third for a title, no text."
- **Ending card plate:** "Slow drift through [abstract shapes or light] in [brand colours], very calm, no subject, no text."

Generate two or three takes and pick the calmest; busy footage fights the motion.

## 3. Record the Fluid layer

Follow `fluid-video`. For a layer that goes on top, render the scene on a pure key colour so it can be removed:

```tsx
<main style={{ position: "fixed", inset: 0, background: "#00ff00" }}>…</main>
```

Pick a key colour that is not in the brand or the logo. Record at the same format and frame rate as the footage.

## 4. Composite

Logo layer keyed over the footage:

```bash
ffmpeg -i footage.mp4 -i fluid-layer.mp4 -filter_complex \
  "[1:v]colorkey=0x00ff00:0.3:0.1[fg];[0:v][fg]overlay=shortest=1" \
  -c:v libx264 -pix_fmt yuv420p -crf 18 final.mp4
```

Fluid opening, then the footage, then a Fluid ending:

```bash
ffmpeg -i intro.mp4 -i footage.mp4 -i outro.mp4 -filter_complex \
  "[0:v][1:v][2:v]concat=n=3:v=1:a=0" -c:v libx264 -pix_fmt yuv420p -crf 18 final.mp4
```

Scale or crop the footage to the exact size first if the generator returned a different one (`-vf scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920`).

## 5. Check

- The logo is crisp and exact in every frame; the AI footage never shows a fake logo or garbled text.
- The key edges are clean (raise or lower the second `colorkey` value if a green fringe shows).
- The motion of the footage and of the Fluid layer do not fight: one moves while the other holds.
