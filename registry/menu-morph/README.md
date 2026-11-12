# MenuMorph

The menu button flows into the menu card, and each bar into a row.

## Example

```tsx
import { MenuMorph } from "./MenuMorph";

const [open, setOpen] = useState(false);

<MenuMorph
  open={open}
  onOpenChange={setOpen}
  title="Acme"
  items={[
    { label: "Home", href: "/" },
    { label: "Orders", href: "/orders" },
    { label: "Help", onSelect: openHelp },
  ]}
/>
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| open | boolean |  | Whether the card is open. |
| onOpenChange | (open) => void |  | Called on the button, Esc, a tap outside or choosing an item. |
| items | { label, href?, onSelect? }[] |  | Any number of rows. With `href` a row is a link. |
| title | string |  | Heading shown on the open card. |
| label | string | "Menu" | Accessible name of the button. |
| side | "left" \| "right" | "right" | The side the card opens towards. Put the menu at that edge of your header. |
| width | number | 320 | Width of the open card in px; it never exceeds the screen. |

## Keyboard and screen readers

The button has `aria-expanded`. Esc and a tap outside close it; focus goes back to the button, unless an item's `onSelect` moved it somewhere on purpose.

## Notes

Closed, it takes 48 x 48. Open, the card floats over the page (z-index 20), so place the menu in your header and nothing moves.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
