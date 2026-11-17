# AreaMorph

An area chart that flows from one set of numbers to the next like a liquid, on the same engine that morphs logos.

## Example

```tsx
import { AreaMorph } from "./AreaMorph";

<AreaMorph label="Visitors" values={[20, 34, 28, 52, 46, 70]} max={100} labels={["Jan", "Mar", "May"]} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | Accessible name of the chart. |
| values | number[] |  | The points, from left to right. Change them and the area flows to the new shape. |
| max | number | the largest value | The value at the top. Keep it fixed when the values change, so shapes compare. |
| labels | string[] |  | Text under the chart, spread from left to right. |

## Keyboard and screen readers

The chart is an image named with its label and its values. With reduced motion the area changes at once.

## Notes

`areaPath(values, max)` in `area.ts` draws the area in the 120 box, if you want the shape in your own svg. Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
