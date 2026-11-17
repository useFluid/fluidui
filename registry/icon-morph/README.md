# IconMorph

A round icon button whose icon flows into another: menu and close, play and pause.

## Example

```tsx
import { IconMorph, icons } from "./IconMorph";

<IconMorph on={open} off={icons.menu} onIcon={icons.close} label="Menu" onClick={() => setOpen(!open)} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| on | boolean |  | Which icon is showing. |
| off | string |  | Path shown when `on` is false. Ready ones: `icons.menu`, `play`, `plus`. |
| onIcon | string |  | Path shown when `on` is true. Ready ones: `icons.close`, `pause`, `check`. |
| label | string |  | Accessible name of the button. |
| ...button props |  |  | Anything a `<button>` takes, like `onClick`. |

## Keyboard and screen readers

A real button with `aria-pressed`. Draw your own icons in a 120 x 120 box, filled, not stroked.

## Notes

For a menu that also opens, use MenuMorph.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
