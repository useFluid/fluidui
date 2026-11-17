# Recipes

Common jobs, written by hand. Each one is complete: copy it and change the values.

## Morph between icons

Convert icons once, at module level, then morph freely between them and the built-in shapes. The example above is this recipe, running.

```tsx
import { scalePath, shapes } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";

const play = scalePath("M6 3l14 9-14 9V3Z", 24);
const pause = scalePath("M6 4h4v16H6zM14 4h4v16h-4z", 24);

export function PlayButton({ playing, onToggle }: { playing: boolean; onToggle(): void }) {
  return (
    <button type="button" onClick={onToggle} aria-label={playing ? "Pause" : "Play"}>
      <svg viewBox="0 0 120 120" width={32} height={32} aria-hidden>
        <MorphPath d={playing ? pause : play} fill="currentColor" />
      </svg>
    </button>
  );
}
```

Fluid morphs filled shapes. Many icon sets, Lucide among them, draw icons as strokes: their path is a centre line, not an outline, and filling it gives the wrong shape. Use the set's filled variant (Heroicons `solid`, Phosphor `fill`), or convert strokes to outlines in your design tool before copying the path.

## Morph into your logo

Fit the logo once. A circle, a dot or any built-in shape can then flow into it.

```tsx
import { fitPath, shapes } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";

const logo = fitPath("M50 10…Z");

<svg viewBox="0 0 120 120" width={96} height={96} aria-label="Acme" role="img">
  <MorphPath d={ready ? logo : shapes.dot} fill="var(--fluid-accent)" onRest={() => setShown(true)} />
</svg>;
```

Parts pair up by size, biggest first. A logo with a hole or several letters works; a part with no partner grows from a point.

## A spring without React

`createSpring` is a plain object you step yourself, and `play` runs one shared frame loop that stops when nothing moves.

```ts
import { createSpring, play, springs } from "@usefluid/motion";

const x = createSpring(0, springs.bouncy);
const card = document.querySelector<HTMLElement>(".card")!;

card.addEventListener("pointerenter", () => {
  x.target = 12;
  play((dt) => {
    const moving = x.step(dt);
    card.style.transform = `translateY(${-x.value}px)`;
    return moving;
  });
});
```

## A spring in CSS only

For a transition the browser can run alone, turn a spring into a CSS easing.

```tsx
import { springCss, springs } from "@usefluid/motion";

const rise = springCss(springs.snappy);

<div style={{ transform: shown ? "none" : "translateY(16px)", ...rise.transition("transform") }} />;
```

`transition()` writes each property separately, so a browser without `linear()` keeps the motion and only drops the curve.

## Copy a piece and change it

Every piece is a plain React component with a CSS module. Copy it with the CLI or from its page; after that it is your code.

```bash
npx @usefluid/cli add morph-button
```

Change colours through the `--fluid-*` variables first, so the piece keeps following your theme. Change the component itself for anything else: the README next to it lists its props and what it does for keyboards and screen readers.
