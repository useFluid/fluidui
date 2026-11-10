---
name: fluid-characters
description: Use when the project depends on @usefluid/motion or the user names Fluid, and they want a pet, mascot or assistant face built with Fluid's Pet or Bot. Not for illustrated mascots, 3D characters or avatars without Fluid.
---

# Fluid characters

```bash
npx @usefluid/cli add pet     # or bot, which uses pet as its face
```

## How the character is built

Two layers. The **body** is one outline that Metamorph takes from one silhouette to the next. The **eyes** are cut out of the body by a mask, and each of their measures is a spring: position, openness, and a curve that turns an open eye into a smile or a sleepy line.

The style is minimal: eyes only, no mouth. The mood is told by the eyes and the silhouette.

## Make it the product's own

1. In `Pet.tsx`, change `BODIES` for each mood's silhouette (a soft square, a drop, a pebble; no thin points) and `FACES` for the eyes.
2. The body colour is `--fluid-accent`, or the mascot colour the person chooses.
3. Keep the body a single outline with no holes. Never put the eyes in the same path as the body: small parts cross each other mid-morph and the face tears.

## Tie moods to real events

| Product event | Mood |
|---|---|
| Waiting for the person | `idle` |
| Something worked | `happy` |
| An error or something unexpected | `surprised` |
| No activity for a while | `sleepy` |
| The person is typing or choosing | `curious` |

Never change mood at random.

## Bot

`Bot` uses the Pet as its face. Wire `state` to the real conversation: `listening` while the person types, `thinking` while waiting for the reply, `talking` when the text arrives, `done` at the end. The state is announced through an `aria-live` region.

## Care

- With reduced motion: no breathing, hopping or blinking.
- The character is never the only way information is given; the text is always there too.
- Do not base the character on another brand's mascot or logo.
