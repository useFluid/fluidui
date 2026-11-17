# SplashChoice

An opening: shapes become your logo, it rises, and a picker sends it into other shapes.

## Example

```tsx
import { shapes } from "@usefluid/motion";
import { SplashChoice } from "./SplashChoice";

const seen = typeof window !== "undefined" && sessionStorage.getItem("intro") === "1";

<SplashChoice
  logo={logo}
  as="h1"
  title="Made for"
  word="you."
  finished={seen}
  onDone={() => sessionStorage.setItem("intro", "1")}
  options={[
    { value: "shops", label: "Shops", word: "shops.", shape: shapes.square },
    { value: "apps", label: "Apps", word: "apps.", shape: shapes.capsule },
  ]}
/>
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| logo | string |  | Your logo path. |
| title, word | string |  | The headline and its last word. |
| options | { value, label, word, shape }[] |  | Each option swaps the word and the shape. |
| value, onChange |  |  | Control the choice, or leave it alone. |
| as | "h1" \| "h2" | "h2" | Use h1 when it is the page's main heading. |
| route | string[] |  | Shapes before the logo. |
| finished | boolean | false | Start on the final screen, for later visits. |
| skippable | boolean | true | Any key or tap jumps to the end. |
| onDone | () => void |  | Called when the final screen is reached. |
| play | boolean | true |  |

## Keyboard and screen readers

The picker is a radio group and stays inert until it is visible. Reduced motion shows the final screen.

## Notes

It fills the screen by default; set `--fluid-splash-height` to fit it in a box.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
