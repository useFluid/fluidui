---
name: fluid-video
description: Use when recording a web page or Fluid animation to MP4 with the Fluid CLI (fluid record), or when such a recording is choppy, cut off or blank. Not for editing, cutting or captioning existing videos.
---

# Fluid video

`fluid record` records a page with time stopped: each frame, the clock moves exactly 1/60 s and the screen is captured. The video is smooth on any machine and identical every run, starting at the page's first instant.

## Needs

- `playwright-core` in the project (`npm i -D playwright-core` if missing)
- Chrome or Edge installed
- `ffmpeg` on the PATH

## Steps

### 1. Make a page with only the scene

The scene must not render the app's header, sidebar or banners. Give it its own layout.

Next.js App Router: a route group with its own root layout.

```tsx
// app/(record)/layout.tsx
import "../globals.css";
export default function RecordLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{ margin: 0 }}>{children}</body></html>;
}

// app/(record)/record/page.tsx
import { SplashDots } from "@/components/fluid/splash-dots/SplashDots";
import { logo } from "@/lib/logo";
export default function Record() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "var(--fluid-surface-2)" }}>
      <SplashDots logo={logo} name="Acme" skippable={false} />
    </main>
  );
}
```

Vite or another single-page app: render the scene instead of the app when `location.pathname === "/record"`.

Everything in the video must happen by itself: start timelines on mount, drive interactions with timers. Pass `skippable={false}` to openings.

### 2. Record

```bash
npx @usefluid/cli record http://localhost:3000/record --format story --seconds 6 --out videos/intro.mp4
```

| Format | Size | The page is laid out at |
|---|---|---|
| `story` | 1080 x 1920 | 400 x 711 |
| `post` | 1080 x 1350 | 400 x 500 |
| `square` | 1080 x 1080 | 400 x 400 |
| `wide` | 1920 x 1080 | 711 x 400 |

The short side is always 400 px and is scaled up 2.7 times, so design the scene at those sizes. A production build records smoother than the dev server.

### 3. Check before handing it over

```bash
ffmpeg -i videos/intro.mp4 -vf "select='not(mod(n\,30))',scale=240:-1,tile=4x3" -frames:v 1 sheet.png
```

Look at the sheet:

- Nothing is cut at the edges.
- Text is at least 15 px in the page, which becomes 40 px in the video.
- The last frames hold still for a moment, or flow back into the first if it will loop.
- No other brand's logo appears.

## Common mistakes

| Symptom | Cause and fix |
|---|---|
| The app's header in the video | The scene shares the app layout; give it its own |
| Text cut at the sides | Pieces sized with `cqmin` render bigger at 400 px; shorten the text or size it down on the record page |
| A blank first second | The scene waits for something; start on mount |
