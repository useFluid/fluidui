---
name: fluid-characters
description: Use when the project depends on @usefluid/motion or the user names Fluid, and they want a pet, mascot or assistant face built with Fluid's Pet or Bot. Not for illustrated mascots, 3D characters or avatars without Fluid.
---

# Fluid characters

`Pet` is a soft body that changes silhouette with its mood, and eyes cut out of it. No mouth: the eyes and the silhouette tell the mood. `Bot` is a chat panel with a Pet for a face.

```bash
npx @usefluid/cli add pet    # or bot, which brings pet
```

Read `pet/README.md` and `bot/README.md` for every prop.

## Tie moods to real events

| Product event | Mood |
|---|---|
| Waiting for the person | `idle` |
| Something worked | `happy` (hops twice, then breathes) |
| An error or something unexpected | `surprised` |
| No activity for a while | `sleepy` |
| The person is typing or choosing | `curious` |

Never change mood at random. Pass `still` where nothing should move on its own.

## A support assistant

`Bot` has no input of its own. Pass yours as `children`, and drive `state` from the real conversation:

```tsx
<Bot state={state} messages={messages} name="Acme help">
  <form onSubmit={send}>
    <label htmlFor="ask">Ask a question</label>
    <input id="ask" value={draft} onChange={(e) => { setDraft(e.target.value); setState("listening"); }} />
    <button>Send</button>
  </form>
</Bot>
```

| State | When |
|---|---|
| `idle` | nothing happening |
| `listening` | the person is typing |
| `thinking` | waiting for the answer |
| `talking` | the answer is arriving |
| `done` | answered; go back to `idle` after a moment |

The conversation is announced as a log, with who said each message.

## Make it the product's own

In `Pet.tsx`, change `BODIES` (one soft outline per mood, no thin points) and `FACES` (eye sizes and curves). The colour is `--fluid-accent`. Keep the eyes out of the body path: they are cut by a mask, which keeps the face from tearing mid-morph.

## Check

- The character is never the only place information is given.
- Reduced motion: no breathing, hopping or blinking.
- It is not based on another brand's mascot.
