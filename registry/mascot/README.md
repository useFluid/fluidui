# Mascot

Object mascots, from a coffee mug to a dumbbell, that blink, follow the pointer and flow into each other.

## Example

```tsx
import { Mascot } from "./Mascot";
import { objects, pickObject } from "./objects";

<div style={{ width: 120, height: 120 }}>
  <Mascot object="mug" mood={saved ? "happy" : "idle"} follow label="Lume, our helper" />
</div>

const object = pickObject("we run a small coffee shop");
<Mascot object={object} color="var(--fluid-accent)" />
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| object | string \| MascotObject |  | An id from `objects` (`mug`, `dumbbell`, `controller`, `plant`...) or your own object. Changing it flows one into the other. |
| mood | "idle" \| "happy" \| "surprised" \| "sleepy" \| "curious" | "idle" | Each mood changes the eyes and the pose. |
| color | string | the object's colour | Pass `var(--fluid-accent)` to wear your brand. |
| follow | boolean | false | The eyes follow the pointer, and on touch look at each tap. |
| look | { x, y } |  | Where the eyes look, from -1 to 1. |
| still | boolean | false | No breathing or blinking. |
| label | string |  | Accessible name. Without it the mascot is decorative. |
| className | string |  | It fills its box. |

`pickObject(description)` reads a description in English or Portuguese ("a small gym", "loja de plantas") and returns the closest object. `objects` lists them all, with `name.en`, `name.pt` and their colour.

## Your own object

```ts
const kettle = {
  id: "kettle",
  name: { en: "Kettle", pt: "Chaleira" },
  d: "M30 50H90V100H30Z",
  eyes: { x: 60, y: 74, gap: 12, size: 1 },
  color: "#0d9488",
  words: ["tea", "chá"],
};
<Mascot object={kettle} />
```

Draw it filled in a 120 x 120 box. Parts must not overlap: where two parts overlap, the overlap becomes a hole. Put `eyes` on the largest flat area.

## Colours

Each object comes with its own colour. To change it:

```tsx
<Mascot object="mug" color="#ff5a1f" />

<Mascot object="mug" color="var(--fluid-accent)" />

<Mascot object="mug" color="var(--brand-500)" />
```

Any CSS colour works: hex, `rgb()`, `oklch()` or a variable from your theme. The colour change is animated, so you can tie it to state, for example green when a payment succeeds. The eyes are holes cut out of the shape and show the background behind the mascot.

## Keyboard and screen readers

Decorative unless labelled; with `label` it is an image with that name. Reduced motion stops breathing, blinking and the pose changes. Never the only way information is given.
