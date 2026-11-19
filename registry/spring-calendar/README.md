# SpringCalendar

A month calendar where the selection flows from day to day on a spring, and the month slides in from the side it came from.

## Example

```tsx
import { SpringCalendar } from "./SpringCalendar";

const [date, setDate] = useState<Date | null>(null);
<SpringCalendar value={date} onChange={setDate} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| value | Date \| null |  | The chosen day. The calendar opens on its month, or on today. |
| onChange | (date) => void |  | Called with the day that was chosen. |
| locale | string | the browser's | Language of the month and weekday names. |
| weekStart | 0 \| 1 | 1 | 1 starts weeks on Monday, 0 on Sunday. |
| previousLabel | string | "Previous month" | Accessible name of the back button. |
| nextLabel | string | "Next month" | Accessible name of the forward button. |

## Keyboard and screen readers

A date grid: Tab reaches one day, the arrow keys move by day and week, Page Up and Page Down by month, Home and End to the start and end of the week, and Enter or Space chooses. Each day is read as a full date, the chosen one as selected, and the month name is announced when it changes. With reduced motion nothing slides.

## Notes

`monthGrid` and `moveDate` in `calendar.ts` hold the date logic, if you want it for a range picker of your own. Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
