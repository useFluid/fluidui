# Dashboard

A whole dashboard built from the Data pieces: change the range and every number rolls, the bars rise, the trend flows, the goal fills and the ranking reorders, together.

## Example

```tsx
import { Dashboard } from "./Dashboard";

const [range, setRange] = useState("week");
<Dashboard title="Store" ranges={ranges} value={range} onChange={setRange} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| title | string |  | The heading of the dashboard. |
| ranges | Range[] |  | One entry per tab, such as week, month and year, each with its stats, trend, bars, goal and leaders. See the `Range` type. |
| value | string |  | The id of the range shown. |
| onChange | (id) => void |  | Called when another range is picked. |
| colors | string[] | violet, teal, orange, pink | The colours of the stats and charts, in order. |
| locale | string | the browser's | Locale for numbers and percents. |

## Keyboard and screen readers

The range is a tab list: arrow keys move between ranges. Every piece keeps its own reading: stats read their final values, bars are buttons, the trend is an image, the goal is a progress bar and the ranking is an ordered list. With reduced motion every change is immediate.

## Notes

It is a starting point: copy it, drop the parts you do not need, and feed it your real numbers. Keep `trendMax` and `barsMax` the same across ranges when the numbers are comparable. Every piece inside is yours to change.
