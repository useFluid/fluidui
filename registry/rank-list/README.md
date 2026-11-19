# RankList

A ranking whose rows travel to their new place on springs when the numbers change, with values that roll.

## Example

```tsx
import { RankList } from "./RankList";

<RankList label="Sales this month" items={[{ id: "ana", label: "Ana", value: 610 }, { id: "bruno", label: "Bruno", value: 560 }]} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | The title of the ranking. |
| items | { id, label, value }[] |  | The rows. Ids must be stable: they tell which row moves where. |
| order | "desc" \| "asc" | "desc" | Highest first, or lowest first for times and costs. |
| format | Intl.NumberFormatOptions |  | How values are written, as in `Intl.NumberFormat`. |
| locale | string | the browser's | Locale for the values. |

## Keyboard and screen readers

An ordered list in the ranked order, so screen readers read the places right. The rolling numbers are hidden from them; they read the final value. With reduced motion rows jump to their place.

## Notes

Ties keep the order they were given, so rows never swap back and forth. A row that climbs passes over the others. Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
