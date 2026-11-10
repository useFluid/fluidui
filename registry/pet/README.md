# Pet

A soft character whose body and eyes change with its mood.

## Example

```tsx
import { Pet } from "./Pet";

<div style={{ width: 96, height: 96 }}>
  <Pet mood={saved ? "happy" : "idle"} label="Acme helper" />
</div>
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| mood | "idle" \| "happy" \| "surprised" \| "sleepy" \| "curious" | "idle" | Tie it to real events: done, error, waiting. |
| still | boolean | false | No breathing or blinking. |
| follow | boolean | false | Eyes follow the pointer, and on touch look at each tap. |
| look | { x, y } |  | Where the eyes look, from -1 to 1, when not following. |
| label | string |  | Accessible name. Without it the pet is decorative. |
| className | string |  | It fills its box. |

## Keyboard and screen readers

Decorative unless labelled. Never the only way information is given.

## Notes

It breathes and blinks softly; pass `still` where nothing should move on its own. Happy hops twice. Change `BODIES` and `FACES` in the file to make it your own.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
