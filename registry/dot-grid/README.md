# DotGrid

An activity grid of dots, like a contribution chart: each dot grows on a spring to its level, and a change sweeps across the grid in a diagonal wave.

## Example

```tsx
import { DotGrid } from "./DotGrid";

<DotGrid label="Commits" values={dailyCounts} summary="16 weeks of activity" />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | What the grid shows. Shown under it and used as the accessible name. |
| values | number[] |  | One value per dot, filled column by column. Each becomes one of five levels against the max. |
| max | number | the largest value | The value of the fullest dot. |
| rows | number | 7 | Dots per column: 7 for days of the week. |
| summary | string |  | A sentence for screen readers, such as the total or the busiest day. |
| color | string | `--fluid-accent` | The colour of the fullest dot; the other levels mix it with the surface. |

## Keyboard and screen readers

The grid is an image named with the label and the summary, because hundreds of dots are not useful one by one. With reduced motion dots change at once.

## Notes

`levelOf` in `grid.ts` maps a value to a level from 0 to 4. Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
