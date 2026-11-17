# Fluid by Hand and Engine Engineering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Fluid as good by hand as with AI. Give the repository enforced engineering rules. Make the engine measurably faster without changing what it draws.

**Architecture:** Additive changes to `@usefluid/motion`:

- a `scalePath` helper;
- coded `PathError`s with development-only explanations;
- a `MorphPath` that never crashes and warns about box mismatches in development;
- a faster morph inner loop.

Repository tooling (Biome, size budget, benchmarks) runs in CI. A new English-only "By hand" docs track renders Markdown files through the existing guide system.

**Tech Stack:** TypeScript 7 strict, React 18+, Vitest 5 (with `bench`), happy-dom (dev only), Biome, esbuild (dev only), Next.js 16 static export, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-17-manual-use-engineering-design.md`

## Global Constraints

- `@usefluid/motion` keeps zero runtime dependencies. New tools are root dev dependencies only.
- No existing export, prop, default or rendered output changes. Paths already in the 120 box, including `shapes.dot`, are never resized.
- Development-only code is gated by `isDev()` from `packages/motion/src/dev.ts`. It is `process.env.NODE_ENV !== "production"`, guarded for environments without `process`.
- No code comments. English only in the repository. The new docs pages are English only; their `/pt` routes show the same English text.
- Engine size budget: the gzip size of the minified production bundle, measured before Task 4 starts, plus 15 percent, per entry (`index`, `react`).
- Ship as 0.2.0. Semantic versioning, with a changelog entry for every user-visible change.
- CI stays green: Biome, types, unit tests, size budget, build, end-to-end tests in Edge and WebKit.

## Review Focus

- A path from a 24 x 24 icon and `shapes.circle` alternating in one `MorphPath` inside a `viewBox="0 0 120 120"` svg should warn once in development, naming `scalePath`, and still render (Task 7).
- `scalePath` on an icon whose viewBox does not start at 0 (`"-2 -2 28 28"`) should keep the icon centred where it was relative to its box (Task 6).
- `MorphPath` receiving an empty string or `"hello"` after a valid path should keep the last valid shape and never throw (Task 7).
- The optimized morph has to match the reference output at irregular frame times, like a 100 ms stall or 1/144 s steps, not only at a fixed 1/60 (Task 5).
- In a production build, a `PathError` message is short (code plus link), and development text never appears in the bundle (Tasks 3 and 6).

---

### Task 1: Biome for lint and format

**Files:**

- Create: `biome.json`
- Modify: `package.json` (scripts, devDependencies), `.github/workflows/ci.yml` (check job), every source file touched by formatting

**Interfaces:**

- Produces: `npm run lint` (`biome ci .`), `npm run format` (`biome format --write .`)

- [ ] **Step 1:** Add `@biomejs/biome` as a root dev dependency and `biome.json`:
  - formatter: 2-space indent, line width 160 (the codebase already uses long lines), double quotes;
  - linter: recommended rules;
  - ignore `**/dist`, `**/out`, `**/.next`, `pack`, `apps/site/public`, `**/node_modules`;
  - turn off any recommended rule the current code violates on purpose, and list each one in `ENGINEERING.md` (Task 2) with the reason.
- [ ] **Step 2:** Run `npx biome format --write .`. Then run `npm run typecheck && npm test`. Expected: both pass with no behaviour change.
- [ ] **Step 3:** Run `npx biome ci .`. Expected: exit 0.
- [ ] **Step 4:** Add `npm run lint` as the first step of the `check` job in `ci.yml`.
- [ ] **Step 5:** Commit the config on its own, then the formatting as a separate commit titled "Format the codebase with Biome".

### Task 2: Engineering rules

**Files:**

- Create: `ENGINEERING.md`
- Modify: `CONTRIBUTING.md` (link it, move the "What every piece does" list into it)

**Interfaces:**

- Produces: the rules later tasks follow. In particular, error codes are `FLUID_` plus an uppercase snake name, and development messages say what went wrong and how to fix it.

- [ ] **Step 1:** Write `ENGINEERING.md` with these sections:
  - Public API: names are verbs for functions and nouns for values; controlled pairs are `value`/`onChange` and `open`/`onOpenChange`; every piece passes through `className`.
  - What every piece does: moved from CONTRIBUTING.
  - Errors and warnings: codes, the development and production split, and that a warning fires once.
  - Development-only code: always behind `isDev()`.
  - Size budget: what it measures and how to raise it (a pull request that explains why).
  - Performance: no allocation inside frame loops; benchmarks for engine changes.
  - Tests: what each layer needs.
  - Versioning and changelog.
  - Lint exceptions: from Task 1.

  Add the line: "These rules apply to new code and to any piece a change touches; existing pieces are not retrofitted."
- [ ] **Step 2:** Run `npx biome ci .`. Expected: pass.
- [ ] **Step 3:** Commit.

### Task 3: Size budget in CI

**Files:**

- Create: `scripts/size.mjs`, `size-budget.json`
- Modify: `package.json` (script `size`, dev dependency `esbuild`), `.github/workflows/ci.yml` (run after `build-packages`)

**Interfaces:**

- Produces: `npm run size`. It bundles `packages/motion/dist/index.js` and `packages/motion/dist/react.js` with esbuild (`bundle`, `minify`, `format: "esm"`, `define: { "process.env.NODE_ENV": '"production"' }`, `external: ["react"]`), prints the gzip bytes of each, and exits 1 when either is above `size-budget.json` `{ "index": number, "react": number }`. It also exits 1 if the minified output contains the string `FLUID_DEV_ONLY`. That marker is a constant Task 6 places in development-only text.

- [ ] **Step 1:** Write the script and run it on the current `dist`. Expected: it prints two numbers.
- [ ] **Step 2:** Write `size-budget.json` with each number times 1.15, rounded up.
- [ ] **Step 3:** Run `node scripts/build-packages.mjs && npm run size`. Expected: pass. Temporarily lower a budget by 1 and check that it fails, then restore it.
- [ ] **Step 4:** Add it to CI and commit.

### Task 4: Benchmarks

**Files:**

- Create: `packages/motion/test/engine.bench.ts`
- Modify: `vitest.config.mts` (add `benchmark: { include: ["packages/**/test/**/*.bench.ts"] }`), `package.json` (script `bench`: `vitest bench --run`)

**Interfaces:**

- Produces: these named benchmarks, which Task 5 must improve:
  - `morph frame: circle to logo, 160 points`: one `step(1/60)` plus one `path()` on a morph that is in motion;
  - `morph frame: two-part logo, 160 points`;
  - `sampleContours: logo`;
  - `stepSpring x 1000`;
  - `springCss`.

  Use the Fluid brand logo from `registry/brands.ts` and `RING_AND_DOT` from the existing tests.

- [ ] **Step 1:** Write the benchmarks and run `npm run bench`. Record the ops/s of each in the pull request description as the baseline.
- [ ] **Step 2:** Commit.

### Task 5: Faster morph inner loop

**Files:**

- Modify: `packages/motion/src/morph.ts`, `packages/motion/src/path.ts` (`sampleContours`)
- Test: `packages/motion/test/motion.test.ts`

**Interfaces:**

- Consumes: the benchmarks from Task 4.
- Produces: the same `createMorpher` and `sampleContours` signatures and outputs.

- [ ] **Step 1: Write the equivalence tests.**
  - Test `matches the reference spring step for every point`: step a morph from `shapes.circle` to the brand logo with the frame times `[1/60, 1/144, 0.1, 1/60, 1/30]`. After each step, compare every coordinate of `path()` with a reference morph driven point by point through the public `stepSpring`, using the same per-point `w` that `makeSlot` assigns. The reference builds its `w` with the same formula, which is copied into the test. Expect the maximum difference to be below 0.01, the precision of the serialized path.
  - Test `returns the same contours for the same path twice` for `sampleContours`. Then mutate the first result's arrays, call it again, and assert that the second call is unaffected.
- [ ] **Step 2:** Run `npm test`. Expected: the new tests pass against the current code. They are the reference before any change.
- [ ] **Step 3: Optimize, without changing the outputs:**
  - in `step(dt)`, compute the spring coefficients (`e`, `cos`, `sin` and the factors that depend on `w`, `z` and `dt`) once per point and reuse them for x and y. Cache them per slot and recompute only when `dt` changes;
  - in `path()`, write with two-decimal rounding (`Math.round(v * 100) / 100`) into a reusable array joined once, with no `toFixed` per coordinate. The numbers must equal the current output to two decimals. Formatting such as trailing zeros may differ, and the resting path stays the exact original;
  - in `sampleContours`, keep a small cache of 16 entries, least recently used first, keyed by `count` and `d`. Return copies of the cached typed arrays, so callers can never corrupt it.
- [ ] **Step 4:** Run `npm test && npm run bench`. Expected: all tests pass. `morph frame` is at least 1.5 times the baseline for both morph benchmarks. Record the new numbers in the pull request.
- [ ] **Step 5:** Run `node scripts/build-packages.mjs && npm run size`. Expected: within budget. Commit.

### Task 6: Coded errors and `scalePath`

**Files:**

- Create: `packages/motion/src/dev.ts`
- Modify: `packages/motion/src/path.ts`, `packages/motion/src/index.ts`, `packages/motion/README.md`
- Test: `packages/motion/test/motion.test.ts`

**Interfaces:**

- Produces:
  - `isDev(): boolean`, `warnOnce(code: string, message: string): void` (deduplicated per code and message; prints through `console.warn` only when `isDev()`), and `FLUID_DEV_ONLY` (internal).
  - `type PathErrorCode = "FLUID_PATH_START" | "FLUID_PATH_NUMBER" | "FLUID_PATH_FLAG" | "FLUID_PATH_COMMAND" | "FLUID_PATH_CHARACTER" | "FLUID_PATH_EMPTY" | "FLUID_PATH_NO_SIZE" | "FLUID_VIEWBOX"`.
  - `class PathError extends Error { readonly code: PathErrorCode }`. In production its `message` is `` `${code}: see https://fluidui.willradoux.com/docs/troubleshooting#${code}` ``. In development the message is that text followed by the explanation and the fix, and it contains `FLUID_DEV_ONLY`.
  - `scalePath(d: string, from: number | string, size = 120): string`. `from` is a square side (`24` means `"0 0 24 24"`) or a viewBox string `"minX minY width height"`. Each coordinate maps by `(v - min) * size / max(width, height)`, with the shorter axis centred. An invalid viewBox throws `PathError` `FLUID_VIEWBOX`.

- [ ] **Step 1: Write the failing tests:**
  - `scalePath maps a 24 box icon into the 120 box without fitting it`: a 12 x 12 square at (6, 6) in a 24 box becomes 60 x 60 at (30, 30). Compare the `parsePath` coordinates within 0.01.
  - `scalePath keeps an offset viewBox centred`: `"-2 -2 28 28"`. A point at (12, 12) maps to (60, 60).
  - `scalePath leaves a path already in the box unchanged`: `scalePath(shapes.dot, 120)` matches the `shapes.dot` coordinates within 0.01.
  - `scalePath refuses a broken viewBox`: `"0 0 0 24"` throws `PathError` with `code` `FLUID_VIEWBOX`.
  - `every path error has a code and a link`: for `"L10 10"`, `"M10"`, `"M0 0X"` and `"M0 0Z"`, the thrown `PathError.code` matches `/^FLUID_/`, and the message contains `docs/troubleshooting#`.
- [ ] **Step 2:** Run `npm test`. Expected: the new tests fail (`scalePath` is not exported, and `code` is undefined).
- [ ] **Step 3:** Implement `dev.ts`, the codes on every existing `throw` in `path.ts`, and `scalePath` (reuse `parsePath` and `serializePath`). Export `scalePath`, `PathError` and `PathErrorCode` from `index.ts`.
- [ ] **Step 4:** Run `npm test`. Expected: pass.
- [ ] **Step 5:** In the README "Metamorph" section, document `scalePath` next to `fitPath`, with when to use each. Run `node scripts/build-packages.mjs && npm run size`. Expected: within budget, and no `FLUID_DEV_ONLY` in the production bundle. Commit.

### Task 7: `MorphPath` that never crashes and warns about boxes

**Files:**

- Modify: `packages/motion/src/react.tsx`, `vitest.config.mts` (`environmentMatchGlobs` or a per-file `// @vitest-environment happy-dom` pragma; the pragma is a directive, not a comment), `package.json` (dev dependencies `happy-dom`, `@testing-library/react`)
- Create: `packages/motion/test/react.test.tsx`

**Interfaces:**

- Consumes: `isDev`, `warnOnce`, `PathError`, `sampleContours` from earlier tasks.
- Produces: the same `MorphPath` props. New behaviour:
  - a `d` that throws a `PathError` keeps the last valid shape, calls `warnOnce(error.code, error.message)`, and does not call `onRest`;
  - in development, after each accepted `d`, it reads `el.ownerSVGElement?.viewBox.baseVal`. If the box is set and the path's bounding box is under 30 percent of the box's larger side, or lies more than 10 percent outside the box, it calls `warnOnce("FLUID_BOX_MISMATCH", …)`. The message names `scalePath` and the troubleshooting link.

- [ ] **Step 1: Write the failing tests** in `react.test.tsx`, with `matchMedia` stubbed and a fake `requestAnimationFrame` driven manually:
  - `keeps the last shape when d is not a path`: render with `shapes.circle`, rerender with `"hello"`. The path `d` attribute still describes the circle, and nothing throws.
  - `warns once when a 24 box icon sits in a 120 box`: render inside `<svg viewBox="0 0 120 120">` with the Lucide `circle` icon path in 24 units. `console.warn` is called once with a message containing `scalePath`. A rerender with another 24-unit icon adds no second warning.
  - `stays quiet for a dot that grows into a logo`: render `shapes.dot`, then the brand logo, inside a 120 box. No warning.
  - `does not warn without a viewBox`.
  - `lands on the target at once with reduced motion`: `matchMedia` matches, and after a rerender the `d` attribute equals the new target exactly.
- [ ] **Step 2:** Run `npx vitest run packages/motion/test/react.test.tsx`. Expected: the first two fail.
- [ ] **Step 3:** Implement it in `MorphPath`. The size check must run only inside `isDev()`, so it adds nothing in production.
- [ ] **Step 4:** Run `npm test`, `npm run typecheck`, `node scripts/build-packages.mjs && npm run size`. Expected: all pass. Commit.

### Task 8: "By hand" docs track

**Files:**

- Create: `apps/site/content/by-hand.md`, `apps/site/content/recipes.md`, `apps/site/content/troubleshooting.md`, `apps/site/content/reference.md`
- Modify:
  - `apps/site/lib/guide.ts`: add `"by-hand"`, `"recipes"`, `"troubleshooting"` and `"reference"` after `"installation"`;
  - `apps/site/components/GuidePage.tsx`: these four render their Markdown file with the existing `Markdown` component, for both languages;
  - `apps/site/lib/i18n.ts`: page titles, with the same English titles for `pt`;
  - the `.md` and `llms.txt` routes: include these pages;
  - `apps/site/e2e/site.spec.ts`.

**Interfaces:**

- Consumes: the exact error codes from Tasks 6 and 7 (`FLUID_PATH_*`, `FLUID_VIEWBOX`, `FLUID_BOX_MISMATCH`).
- Produces: the routes `/docs/by-hand`, `/docs/recipes`, `/docs/troubleshooting`, `/docs/reference`. Troubleshooting has one heading per code, with the anchor id equal to the code, so the links from error messages land on it.

- [ ] **Step 1: Write the failing end-to-end tests:**
  - `the by-hand docs exist in both languages`: each of the four routes, under `/` and `/pt`, returns a page whose `h1` is the English title, with no console errors, and is included in the existing axe check list (`PAGES`).
  - `every error code has a troubleshooting entry`: for each code in the list, `/docs/troubleshooting#CODE` has an element with `id=CODE`.
  - `the by-hand recipe morphs a Lucide icon`: the recipe page has a live example rendering `MorphPath` with `scalePath(icon, 24)` inside a 120 box. After 2 seconds there are no console warnings.
- [ ] **Step 2:** Run `npm run build && npx playwright test --project=edge -g "by-hand|troubleshooting"`. Expected: fail.
- [ ] **Step 3:** Write the four pages:
  - `by-hand`: install, theme, a spring on a value with `useSpring`, a first morph, all in under ten minutes, with no CLI and no AI;
  - `recipes`: Lucide and Heroicons icons with `scalePath`, your logo with `fitPath`, a spring on any value without React using `createSpring` and `play`, copy a piece and adapt it;
  - `troubleshooting`: one section per code, covering what happened, why, and the fix with code;
  - `reference`: every export of `@usefluid/motion` and `@usefluid/motion/react`, with its signature and a one-line example.

  Add the live example to `recipes` as a small client component.
- [ ] **Step 4:** Run `npm run build && npx playwright test --project=edge`. Expected: all pass. Commit.

### Task 9: Release 0.2.0

**Files:**

- Modify: `CHANGELOG.md`, `README.md` (link to "By hand")

- [ ] **Step 1:** Add the `## 0.2.0` changelog entry, covering:
  - `scalePath`;
  - coded errors and the troubleshooting page;
  - the safer `MorphPath` and its box warning;
  - the faster morph, with the before and after benchmark numbers from Tasks 4 and 5;
  - the "By hand" docs;
  - Biome, the size budget and `ENGINEERING.md`.
- [ ] **Step 2:** Run the full check: `npm run lint && npm run typecheck && npm test && npm run build && node scripts/build-packages.mjs && npm run size`. Expected: all pass.
- [ ] **Step 3:** Commit, open the pull request, wait for CI and merge. The GitHub release `v0.2.0` is created by Willian.
