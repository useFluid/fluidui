# ProgressRing

A ring that fills on a spring toward a goal, with the percent rolling in the middle and a small swell when it is complete.

## Example

```tsx
import { ProgressRing } from "./ProgressRing";

<ProgressRing label="Monthly goal" value={73} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | What is measured. Shown under the percent and used as the accessible name. |
| value | number |  | How much is done. Change it and the ring flows to it. |
| max | number | 100 | The goal. |
| size | number | 168 | Width and height in pixels. |
| locale | string | the browser's | Locale for the percent. |

## Keyboard and screen readers

A progress bar with its label, minimum, maximum and current value. With reduced motion the ring changes at once and does not swell.

## Notes

The spring overshoots a little, so the ring passes its mark and comes back. Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
