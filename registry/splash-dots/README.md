# SplashDots

An opening: scattered dots fly to your logo's outline, it fills in and the name comes in.

## Example

```tsx
import { SplashDots } from "./SplashDots";

<SplashDots logo={logo} name="Acme" as="h1" finished={seen} onDone={remember} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| logo | string |  | Your logo path. |
| name | string |  |  |
| as | "h1" \| "h2" \| "p" | "p" |  |
| finished | boolean | false |  |
| skippable | boolean | true |  |
| onDone | () => void |  |  |
| play | boolean | true |  |

## Keyboard and screen readers

The name is read as text. Reduced motion shows the final screen.

## Notes

It fills the screen by default; set `--fluid-splash-height` to fit it in a box.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
