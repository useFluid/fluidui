# @usefluid/motion

The engine behind Fluid: exact springs and **Metamorph**, contour morphing that works with any logo. No dependencies. React bindings are optional.

```bash
npm i @usefluid/motion
```

## Springs

Solved with the closed-form solution, so the result is the same at 30 or 240 frames per second and nothing shakes when it lands.

```ts
import { createSpring, springs, play } from "@usefluid/motion";

const x = createSpring(0, springs.snappy); // { w: frequency, z: damping }
x.target = 200;
play((dt) => {
  const moving = x.step(dt);
  el.style.transform = `translateX(${x.value}px)`;
  return moving; // the shared frame loop stops by itself when nothing moves
});
```

Presets: `springs.snappy`, `springs.soft`, `springs.bouncy`, `springs.firm`. `springCss(config)` turns a spring into a CSS `linear()` easing and its duration, for cheap transitions. Its `transition(property, delay)` returns the transition as separate properties, so a browser without `linear()` (Safari before 17.2) only drops the curve and still animates: `style={{ transform, ...rise.transition("transform") }}`.

## Metamorph

A shape becomes points spread evenly along its border, each on its own spring with a slightly different frequency, so a shape arrives like a liquid. Open letters, holes and logos in several parts all work, and at rest the exact original path comes back.

```ts
import { createMorpher, fitPath, shapes } from "@usefluid/motion";

const logo = fitPath(svgPathData); // any path, any size, into a 120 x 120 box
const m = createMorpher(shapes.circle, { w: 14, z: 0.8 });
m.to(logo);
play((dt) => {
  const moving = m.step(dt);
  pathEl.setAttribute("d", m.path());
  return moving;
});
```

Rules that keep a morph clean:

- Parts pair up by size, biggest first. Keep the same order of sizes between states, or parts swap places on the way.
- A part with no partner is born from, or shrinks into, a point.
- `spread` (default 0.22) is how much the points' speeds differ. More reads as liquid; over long distances keep it low, or the outline stretches into spikes.

Starting shapes in a 120 box: `shapes.dot`, `circle`, `square`, `capsule`, `triangle`, `flower`, `drop`, `pebble`.

## React

```tsx
import { MorphPath, useSpring, useSequence, useReducedMotion, useInView } from "@usefluid/motion/react";

// A path that flows into any new d. The server renders the exact path.
<svg viewBox="0 0 120 120">
  <MorphPath d={open ? logo : shapes.circle} fill="currentColor" onRest={() => setReady(true)} />
</svg>;

// Named values on springs, applied every frame without re-rendering React.
useSpring({ x: open ? 200 : 0 }, ({ x }, velocity) => {
  ref.current.style.transform = `translateX(${x}px)`;
});

// A timeline: returns the index of the latest time (in seconds) reached.
const step = useSequence([0, 0.4, 0.8, 1.6], inView);
```

With `prefers-reduced-motion`, springs jump to their targets, morphs land at once and sequences go straight to their last step.

## Theme

Every Fluid piece reads ten CSS variables. Import the defaults and override them with your brand:

```ts
import "@usefluid/motion/theme.css";
```

`--fluid-accent`, `--fluid-on-accent`, `--fluid-surface`, `--fluid-surface-2`, `--fluid-text`, `--fluid-text-2`, `--fluid-border`, `--fluid-focus`, `--fluid-radius`, `--fluid-font`.

## Licence

MIT
