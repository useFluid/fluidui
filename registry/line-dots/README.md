# LineDots

A line chart whose points each ride a spring of their own, so a change ripples along the line, with a value bubble that slides between points.

## Example

```tsx
import { LineDots } from "./LineDots";

<LineDots label="Signups" values={[24, 38, 31, 56]} labels={["Jan", "Feb", "Mar", "Apr"]} max={100} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | Accessible name of the chart. |
| values | number[] |  | The points, from left to right. Change them and the line flows to them. |
| labels | string[] |  | One label per point, unique, shown under the chart. |
| max | number | the largest value | The value at the top. Keep it fixed when the values change. |
| format | Intl.NumberFormatOptions |  | How values are written, as in `Intl.NumberFormat`. |
| locale | string | the browser's | Locale for the values. |
| color | string | `--fluid-accent` | Colour of the line, the dots and the fill. |

## Keyboard and screen readers

Each point is a button named with its label and value. Tab reaches the chart once; the arrow keys, Home and End move between points, and the bubble follows. With reduced motion the line changes at once.

## Notes

The chart measures its width, so the dots stay round at any size. `pointsOf` and `linePath` in `line.ts` draw the line, if you want it in your own svg. Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
