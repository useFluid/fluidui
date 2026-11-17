# SpringBars

A bar chart whose bars rise like liquid, each on a spring of its own, with a value bubble that flows to the bar you point at.

## Example

```tsx
import { SpringBars } from "./SpringBars";

<SpringBars label="Orders this week" max={100} data={[{ label: "Mon", value: 32 }, { label: "Tue", value: 48 }]} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | Accessible name of the chart. |
| data | { label, value }[] |  | One bar per item. Labels must be unique. Change the values and the bars flow to them. |
| max | number | the largest value | The value of a full bar. Keep it fixed when the data changes, so bars compare across changes. |
| format | Intl.NumberFormatOptions |  | How values are written, as in `Intl.NumberFormat`. |
| locale | string | the browser's | Locale for the values. |

## Keyboard and screen readers

Each bar is a button named with its label and value. Tab reaches the chart once; the arrow keys, Home and End move between bars, and the bubble follows. With reduced motion bars change at once.

## Notes

Bars further right use slightly slower springs, so a change ripples across the chart. Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
