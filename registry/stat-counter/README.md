# StatCounter

A dashboard number that rolls to its new value on a spring, with a change badge whose arrow flows up or down.

## Example

```tsx
import { StatCounter } from "./StatCounter";

<StatCounter label="Revenue today" value={16902} previous={13380} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| label | string |  | What the number is. |
| value | number |  | The number. Change it and the digits roll to it. |
| previous | number |  | The value to compare with. The badge shows the change in percent. Leave it out to hide the badge. |
| format | Intl.NumberFormatOptions |  | Currency, percent, units and decimals, as in `Intl.NumberFormat`. |
| locale | string | the browser's | Locale for the number. |
| upIsGood | boolean | true | Set to false when a rise is bad news, such as costs or errors: the badge turns red when the number goes up. |

## Keyboard and screen readers

The rolling digits are hidden from screen readers. They read the label, the final value, and "up" or "down" with the percent. With reduced motion the number changes at once.

## Notes

Every colour comes from the `--fluid-*` variables, except green and red for the change, and the piece is yours to change.
