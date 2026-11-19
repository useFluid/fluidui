# Changelog

## 0.2.0

Fluid by hand: the same quality without an agent.

- Four new pieces in a new Data category, for dashboards: Stat Counter (a number that rolls to its value, with an arrow that flows up or down), Spring Bars (bars that rise like liquid), Area Morph (an area chart that flows between data sets on the morph engine) and Spring Calendar (a selection that travels between days, with keyboard date navigation), Progress Ring (a goal ring that fills on a spring) and Rank List (a leaderboard whose rows slide to their new place).
- Dashboard puts the Data pieces together: change the range and every number, bar, trend, goal and ranking moves at once, in a palette of colours you can replace. Every Data piece takes a `color`, and Spring Bars a colour per bar.
- `scalePath(d, box)` brings a path from any viewBox (`24`, or `"0 0 20 20"`) into the 120 box, keeping its size relative to its box, so filled icons from icon sets morph with the built-in shapes and your logo. `fitPath` stays the tool for logos.
- Every `PathError` has a code, such as `FLUID_PATH_NUMBER`, and a link to its fix on the new [troubleshooting page](https://fluidui.willradoux.com/docs/troubleshooting). In development the message also explains what went wrong; production builds keep only the code and the link. `PathError` still accepts plain text.
- `MorphPath` never crashes on a bad `d`: it keeps the last good shape, or waits for the first valid one, and in development warns once with the code. Also in development, it warns with the fix when a path does not fit its svg viewBox. The warnings work with Next.js, Vite, webpack and esbuild, and none of their text reaches production builds.
- The morph is about 2.3 times faster: a circle-to-logo frame went from 24,163 to 56,420 per second, and a two-part logo from 8,851 to 20,215. Its output matches the previous engine within 0.01. Contours of a path are measured once and reused.
- A failed `to()` or `jump()` no longer leaves a morph half changed.
- A frame time that is not a positive number (`NaN`, `Infinity`, zero or negative) is skipped: a morph no longer jumps to its end, and a spring no longer gets stuck at `NaN`.
- New docs for working without AI: [Start by hand](https://fluidui.willradoux.com/docs/by-hand), [Recipes](https://fluidui.willradoux.com/docs/recipes), [Troubleshooting](https://fluidui.willradoux.com/docs/troubleshooting) and a [Reference](https://fluidui.willradoux.com/docs/reference) of every export.
- For contributors:
  - [ENGINEERING.md](ENGINEERING.md) sets the rules for the API, errors, size, performance and tests;
  - Biome lints and formats the code;
  - `npm run size` keeps the engine under a size budget in CI;
  - `npm run bench` measures it.

## 0.1.2

- Splash Dots fits long brand names: the name scales with its length, centred, never below 20 px.
- Segmented Picker follows options that change width, so its pill stays on the right option.

## 0.1.1

- Both packages point to the new home of the project, [useFluid/fluidui](https://github.com/useFluid/fluidui).
- Published from GitHub Actions with npm trusted publishing and provenance.

## 0.1.0

The first public release.

- `@usefluid/motion`: closed-form springs, Metamorph contour morphing, `springCss` with a fallback for browsers without `linear()`, and React bindings: `MorphPath`, `useSpring`, `useSequence`, `useSkip`, `useInView` and `useReducedMotion`.
- `@usefluid/cli`: `list`, `add` with dependencies, `init`, `logo` and `record`.
- 22 pieces in six families: Metamorph, Characters, Controls, Text, Transitions and Splash, with over thirty object mascots.
- Seven agent skills: brand, components, Metamorph, splash, characters, video and AI video.
- Docs at [fluidui.willradoux.com](https://fluidui.willradoux.com), in English and Portuguese, with Markdown pages and `llms.txt` for agents.
