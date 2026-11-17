# Start by hand

Install the engine, give it your brand, and write your first spring and your first morph. No CLI, no agent, about ten minutes.

## Install

Fluid's engine has no dependencies. React is optional, and only needed for the bindings in `@usefluid/motion/react`.

```bash
npm i @usefluid/motion
```

## Theme

Import the ten variables once, then point them at your own tokens. Every Fluid piece reads them, and so can your own components.

```tsx
import "@usefluid/motion/theme.css";
```

```css
:root {
  --fluid-accent: #3262fb;
  --fluid-on-accent: #ffffff;
  --fluid-radius: 14px;
  --fluid-font: "Inter", sans-serif;
}
```

## A spring on a value

`useSpring` moves named values on springs and calls you every frame, without re-rendering React. Write the result to the element yourself.

```tsx
import { useSpring } from "@usefluid/motion/react";
import { useRef, useState } from "react";

export function Drawer() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useSpring({ x: open ? 0 : 320 }, ({ x }) => {
    if (panel.current) panel.current.style.transform = `translateX(${x}px)`;
  });
  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)}>
        Menu
      </button>
      <div ref={panel} className="drawer">
        …
      </div>
    </>
  );
}
```

Springs settle exactly on the target and give the same result at 30 or 240 frames per second. With reduced motion on, they jump straight to the target.

## A first morph

`MorphPath` draws a path and flows into every new `d` you give it. Built-in shapes and logos live in a 120 x 120 box, so the svg uses that box.

```tsx
import { shapes } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";

<svg viewBox="0 0 120 120" width={48} height={48}>
  <MorphPath d={on ? shapes.flower : shapes.circle} fill="currentColor" />
</svg>;
```

## Paths from anywhere

Icons and logos come in other boxes. Bring them into the 120 box once, outside the component:

| Path from                                                                           | Use                                                |
| ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| A filled icon with `viewBox="0 0 24 24"` (Heroicons solid, Phosphor fill, Material) | `scalePath(d, 24)`                                 |
| Any other viewBox                                                                   | `scalePath(d, "0 0 20 20")`                        |
| Your logo from any SVG                                                              | `fitPath(d)`, or `npx @usefluid/cli logo logo.svg` |

Morphs work on filled shapes: for icon sets drawn with strokes, use their filled variant. `scalePath` keeps the icon's size and place inside its box. `fitPath` fills the whole box with the drawing. If a path does not fit its box, `MorphPath` tells you in the console during development, with the fix.

## Next

- [Recipes](/docs/recipes) for icons, logos, springs without React and copying a piece.
- [Troubleshooting](/docs/troubleshooting) for every error and warning.
- [Reference](/docs/reference) for every export.
