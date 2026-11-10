---
name: fluid-metamorph
description: Builds new animated components with the Fluid engine (@usefluid/motion) - Metamorph contour morphing between any shapes or logos, exact springs and timelines - following the rules that keep morphs clean. Use when someone wants a shape, icon, logo or UI element to morph into another, or a new piece "in the Fluid style".
---

# Building with Metamorph

Metamorph turns any outline into points spread evenly along its border, each on its own spring with a slightly different frequency. That is what makes a shape arrive like a liquid instead of a straight tween. At rest, the exact original path comes back, curves and corners included.

```bash
npm i @usefluid/motion
```

## The three tools

```tsx
import { fitPath, shapes, springs } from "@usefluid/motion";
import { MorphPath, useSpring, useSequence } from "@usefluid/motion/react";

// 1. A path that flows to any new d. Put it in an SVG with a 120 x 120 viewBox.
<svg viewBox="0 0 120 120">
  <MorphPath d={open ? icons.close : icons.menu} fill="currentColor" config={{ w: 18, z: 0.78 }} onRest={next} />
</svg>;

// 2. Numbers on springs, applied straight to the DOM every frame, without re-rendering React.
useSpring({ w: open ? 320 : 48 }, ({ w }, velocity) => {
  ref.current.style.width = `${w}px`;
}, springs.snappy);

// 3. A timeline in seconds; returns the index of the step reached.
const step = useSequence([0, 0.4, 0.8, 1.4], inView);
```

`fitPath(d, 120)` fits any path into the box. `shapes.dot`, `circle`, `square`, `capsule`, `triangle`, `flower`, `drop` and `pebble` are ready-made starts.

## Springs

`w` is the frequency (higher is faster), `z` is the damping (below 1 overshoots, 1 lands without overshoot). Good ranges: `w` 12 to 24, `z` 0.7 to 0.86. Below 0.6 it wobbles, and people read wobble as a bug.

## Rules that keep a morph clean

1. **Parts pair up by size, biggest first.** If a shape has a body and two eyes, every state must keep the same order of sizes, or parts swap places mid-flight.
2. **Small details do not belong in the same path as a big body.** Faces, labels and dots morphing inside a body tear. Draw them as separate elements on springs, or as holes in a mask, and morph only the body.
3. **Extra parts are born from a point.** Going from three bars to one X, two bars shrink away. That is fine and reads well.
4. **Spread is for short trips.** `spread` (default 0.22) is how much the points' speeds differ. Over long distances (a tile growing into a full window) keep it near 0.05, or go through an intermediate shape (a drop) first.
5. **Draw in the same box.** All the states of one morph live in the same viewBox, usually 120 x 120.
6. **Fill, do not stroke.** Morph filled shapes. A stroke becomes a filled outline (`fluid logo` handles this for logos).

## Every new piece

- Start from an existing piece that is close (`npx @usefluid/cli add icon-morph`) and change it.
- Read the brand only through the `--fluid-*` variables.
- Keyboard, focus, `aria-pressed`, `aria-expanded` or a `role="status"` region: the state must be available without the animation.
- Reduced motion: the hooks jump to the end on their own. Check CSS animations too.
- No autoplay in the product.
