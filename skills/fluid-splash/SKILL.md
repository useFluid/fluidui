---
name: fluid-splash
description: Use when the project depends on @usefluid/motion or the user names Fluid, and they want an opening, intro or splash built from their logo with Fluid. Not for native app launch screens or splash screens without Fluid.
---

# Fluid opening

An opening is shapes flowing into the logo, the logo rising, and the headline coming out of a blur, ending on the real page. It plays once per visit, can be skipped, and never blocks the product.

## Pick a model

| Model | Ends on | Good for |
|---|---|---|
| `splash-shapes` | your own content (`children`) | a home page with a headline and a call to action |
| `splash-choice` | a picker that sends the logo into other shapes | products with several audiences |
| `splash-dots` | the brand name | brands where the name matters |

```bash
npx @usefluid/cli add splash-shapes
```

The brand must be set first (`fluid-brand`): the pieces take `logo` from `fluid logo`.

## Steps

### 1. Write the words

The headline is `title` plus words that change. Keep each changing word to one or two words: they do not wrap. Too long? Shorten it, or put the long line in `children` as normal text.

### 2. Build it to end on the real page

```tsx
"use client";
import { useEffect, useState } from "react";
import { SplashShapes } from "@/components/fluid/splash-shapes/SplashShapes";
import { logo } from "@/lib/logo";

export function Opening() {
  const [seen, setSeen] = useState<boolean | null>(null);
  useEffect(() => setSeen(sessionStorage.getItem("opening") === "1"), []);
  if (seen === null) return null;
  return (
    <SplashShapes
      logo={logo}
      as="h1"
      title="Small-batch coffee,"
      words={["roasted.", "every morning."]}
      finished={seen}
      onDone={() => sessionStorage.setItem("opening", "1")}
    >
      <p>Order ahead and pick up on your way.</p>
      <a href="/order">Order now</a>
    </SplashShapes>
  );
}
```

- `finished` starts on the final screen for later visits.
- Any key or tap skips to the end (`skippable`, on by default).
- `as="h1"` when it is the page's main heading.
- `route={[...]}` changes the shapes before the logo; prefer shapes related to the brand.
- It fills the screen; set `--fluid-splash-height` on a parent to fit it in a box.

### 3. Check

- Reduced motion shows the final screen at once.
- The content is not clickable or focusable before it shows (the pieces make it inert).
- At 320 px nothing is cut off or scrolls sideways.
- It is free for interaction in under 5 s. The default route takes about 4.8 s; a shorter `route` is faster.
- With server rendering and no JavaScript, the page still shows its content. In a client-only app this does not apply.

## Common mistakes

| Mistake | Fix |
|---|---|
| A long sentence as a changing word | One or two words; the rest as normal text |
| The last shape of the route looks like the logo | Change `route`, so the logo's arrival reads |
| Playing it on every page | Only on the first screen, once per visit |
