---
name: fluid-video
description: Use when recording a web page or Fluid animation to MP4 with the Fluid CLI (fluid record), or when such a recording is choppy, cut off or blank. Not for editing, cutting or captioning existing videos.
---

# Fluid video

The video is recorded with time stopped: each frame the clock moves 1/60 s and the screen is captured. That is why it is smooth even on a slow machine and the same every run. It works for Fluid pieces and for any page made with CSS or JavaScript animation.

## Needs

```bash
npm i -D playwright-core       # drives the browser
# Chrome or Edge installed, and ffmpeg on the PATH (https://ffmpeg.org/download.html)
```

## 1. Make a page that shows only the scene

Create a route that renders just the animation, full screen, no navbar or cookie banner:

```tsx
// app/record/page.tsx (Next.js) or any route in your framework
import { SplashChoice } from "@/components/fluid/splash-choice/SplashChoice";
import { logo } from "@/lib/logo";

export default function Record() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "var(--fluid-surface-2)" }}>
      <SplashChoice logo={logo} title="Made for" word="you." options={[]} />
    </main>
  );
}
```

Design it for a phone: the recorder lays the page out at about 400 px wide and captures it at high density, so text reads on a phone screen.

Anything that should happen in the video must happen on its own: start the timeline on mount, drive interactions with timers.

## 2. Record

```bash
npm run dev    # or a production build, which is smoother
npx @usefluid/cli record http://localhost:3000/record --format story --seconds 8 --out videos/intro.mp4
```

| Option | Values |
|---|---|
| `--format` | `story` 1080x1920, `post` 1080x1350, `square` 1080x1080, `wide` 1920x1080 |
| `--seconds`, `--fps` | length and frame rate (default 6 and 60) |
| `--browser` | `chrome` (default) or `msedge` |

## 3. Check before you hand it over

Pull a contact sheet and look at it:

```bash
ffmpeg -i videos/intro.mp4 -vf "select='not(mod(n\,30))',scale=200:-1,tile=8x2" -frames:v 1 sheet.png
```

- The first and last frames are clean, nothing cut mid-move.
- Text is readable on a phone: in a story, no letter under 40 px tall.
- The video uses no other brand's logo.
- Loop: if it will loop, the last frame should flow into the first.
