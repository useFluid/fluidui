# SplashShapes

An opening: shapes become your logo, it rises, the headline's words change and your content appears.

## Example

```tsx
import { SplashShapes } from "./SplashShapes";

<SplashShapes logo={logo} as="h1" title="Coffee," words={["roasted.", "today."]} finished={seen} onDone={remember}>
  <p>Order ahead and pick up on your way.</p>
  <a href="/order">Order now</a>
</SplashShapes>
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| logo | string |  | Your logo path. |
| title | string |  | The fixed part of the headline. |
| words | string[] |  | The words that cycle once and stop on the last. |
| children | ReactNode |  | Your real content, shown at the end. |
| action, onAction |  |  | A ready button instead of children. |
| as | "h1" \| "h2" | "h2" |  |
| route | string[] |  |  |
| finished | boolean | false |  |
| skippable | boolean | true |  |
| onDone | () => void |  |  |
| play | boolean | true |  |

## Keyboard and screen readers

The content is inert until visible. Reduced motion shows the final screen.

## Notes

It fills the screen by default; set `--fluid-splash-height` to fit it in a box.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
