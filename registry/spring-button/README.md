# SpringButton

A pill button that gives a little under the finger and springs back.

## Example

```tsx
import { SpringButton } from "./SpringButton";

<SpringButton onClick={save}>Save</SpringButton>
<SpringButton variant="quiet" onClick={cancel}>Cancel</SpringButton>
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| variant | "solid" \| "quiet" | "solid" | Main or secondary action. |
| pressed | boolean |  | Show it held down, for showcases. |
| ...button props |  |  |  |

## Keyboard and screen readers

A plain button with a visible focus ring.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
