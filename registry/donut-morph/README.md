# DonutMorph

A donut chart whose slices slide and grow on springs when the numbers change, with the total rolling in the middle and a legend in percent.

## Example

```tsx
import { DonutMorph } from "./DonutMorph";

<DonutMorph label="Visits" parts={[{ label: "Direct", value: 420 }, { label: "Search", value: 260 }]} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | What is counted. Shown under the total and used as the accessible name. |
| parts | { label, value, color? }[] |  | One slice per part. Labels must be unique. Without a colour, parts take violet, teal, orange, pink and blue in order. |
| format | Intl.NumberFormatOptions |  | How the total and values are written, as in `Intl.NumberFormat`. |
| locale | string | the browser's | Locale for numbers and percents. |

## Keyboard and screen readers

The ring is decoration; the legend is a list that reads each part with its percent and value. With reduced motion slices change at once.

## Notes

Each slice has a slightly slower spring than the one before, so a change travels around the ring. `slices` in `donut.ts` turns values into starts and shares. Every colour is yours to change.
