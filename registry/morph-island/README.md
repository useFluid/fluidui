# MorphIsland

A small pill that flows into a panel and back.

## Example

```tsx
import { MorphIsland } from "./MorphIsland";

<MorphIsland label="Quick add" width={300} height={170}>
  <form>...</form>
</MorphIsland>
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | The pill's text and the button's name. |
| children | ReactNode |  | The panel's content. |
| width, height | number | 300, 170 | Open size in px. |
| closedWidth | number | 150 | Closed size in px. |
| open, onOpenChange |  |  | Control it from outside, or leave it alone. |
| closeLabel | string | "Close" |  |

## Keyboard and screen readers

Esc closes it and gives focus back to the pill.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
