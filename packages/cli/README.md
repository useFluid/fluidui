# @usefluid/cli

Add Fluid pieces to your project, set up your brand, convert your logo and record video.

```bash
npx @usefluid/cli list
npx @usefluid/cli add splash-choice pet     # copies the pieces, and the pieces they use
npx @usefluid/cli init                      # writes fluid-theme.css with the --fluid-* variables
npx @usefluid/cli logo public/logo.svg --out src/logo.ts
npx @usefluid/cli record http://localhost:3000/intro --format story --seconds 8
```

The pieces are copied into your code (`src/components/fluid` by default), so they are yours to change. They run on the engine:

```bash
npm i @usefluid/motion
```

## Logo

`fluid logo` reads paths, circles, ellipses, rectangles and polygons, joins them and fits the drawing to the 120 x 120 box the pieces use. It refuses SVGs with `transform`: export the logo again with transforms applied and strokes converted to outlines.

## Record

`fluid record` opens the page with a paused clock and moves it one frame at a time, so the video is smooth on any machine and the same every time. It needs `playwright-core` (`npm i -D playwright-core`), Chrome or Edge, and `ffmpeg` on your PATH.

Formats: `story` 1080x1920, `post` 1080x1350, `square` 1080x1080, `wide` 1920x1080.

## Licence

MIT
