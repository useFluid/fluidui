---
name: fluid-metamorph
description: Use when building a new component with the Fluid engine (@usefluid/motion: MorphPath, useSpring, createMorpher) or when a Fluid morph tears, twists or spikes. Not for SVG morphing with other libraries.
---

# Building with Metamorph

Metamorph turns an outline into points spread evenly along its border, each on its own spring with a slightly different frequency. That is why a shape arrives like a liquid instead of a straight tween. At rest, the exact original path comes back, curves and corners included.

## The tools

| Tool | What it does |
|---|---|
| `<MorphPath d={...} />` | A path that flows to every new `d`. `onRest` fires when it lands. |
| `useSpring(values, apply, config)` | Numbers on springs, applied to the DOM every frame without re-rendering React. |
| `useSequence(times, active)` | A timeline in seconds; returns the index of the step reached. |
| `useSkip(enabled, initial)` | True after any key or tap, for skippable sequences. |
| `fitPath(d, 120)` | Fits any path into the 120 box. |
| `shapes` | Ready starts: `dot`, `circle`, `square`, `capsule`, `triangle`, `flower`, `drop`, `pebble`. |

```tsx
import { shapes, springs } from "@usefluid/motion";
import { MorphPath, useSpring } from "@usefluid/motion/react";

<svg viewBox="0 0 120 120">
  <MorphPath d={open ? logo : shapes.circle} fill="currentColor" config={{ w: 18, z: 0.78 }} />
</svg>;

useSpring({ w: open ? 320 : 48 }, ({ w }) => {
  ref.current.style.width = `${w}px`;
}, springs.snappy);
```

Every hook jumps to its end when the system asks for reduced motion.

## Springs

`w` is the frequency (higher is faster) and `z` the damping (below 1 overshoots, 1 lands without overshoot). Good ranges: `w` 12 to 24, `z` 0.7 to 0.86. Below 0.6 it wobbles, and people read wobble as a bug.

## Rules that keep a morph clean

1. **Parts pair up by size, biggest first.** Every state must keep the same order of sizes, or parts swap places mid-flight.
2. **Small details stay out of a big body's path.** Eyes, labels and dots inside a body tear. Draw them as separate elements on springs, or as holes in a mask, and morph only the body.
3. **Extra parts are born from a point.** Three bars to one X: two bars shrink away. That reads well.
4. **Spread is for short trips.** `spread` (default 0.22) is how much the points' speeds differ. Over long distances keep it near 0.05, or go through an intermediate shape first. For a whole window, animate its edges instead, as `MorphDialog` does.
5. **One box for all states.** Every state of a morph lives in the same viewBox, usually 120 x 120.
6. **Fill, do not stroke.** Morph filled shapes. Stroked icons must be converted to outlines in the design tool first.

## When a morph looks wrong

| Symptom | Cause | Fix |
|---|---|---|
| Parts swap or cross mid-flight | Different size order between states | Same number and order of parts, biggest first |
| The shape tears | Small details inside the body path | Move them out (rule 2) |
| Spikes on long trips | Too much spread | `spread` near 0.05 |
| Twisting | Very different start points | Start both paths at the same side, or go through a simple shape |

## A new piece

1. Start from the closest piece: `npx @usefluid/cli add icon-morph`, and change it.
2. Read colours only from the `--fluid-*` variables.
3. Expose the state without the animation: `aria-pressed`, `aria-expanded`, or a `role="status"` region.
4. Check CSS animations under reduced motion too; the hooks already handle theirs.
5. Nothing animates by itself in the product.
6. Write its `README.md`: example, props, keyboard and screen readers.
