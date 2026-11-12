# Bot

A chat assistant with a Pet for a face that listens, thinks and answers.

## Example

```tsx
import { Bot, type BotState, type Message } from "./Bot";

<Bot state={state} messages={messages} name="Acme help">
  <form onSubmit={send}>
    <label htmlFor="ask">Ask a question</label>
    <input id="ask" value={draft} onChange={(e) => { setDraft(e.target.value); setState("listening"); }} />
    <button>Send</button>
  </form>
</Bot>
```

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| state | "idle" \| "listening" \| "thinking" \| "talking" \| "done" |  | listening while the person types, thinking while waiting, talking when the answer arrives, then done or idle. |
| messages | { id, from: "person" \| "bot", text }[] |  | The conversation. |
| name | string | "Assistant" | Shown and announced. |
| you | string | "You" | How the person's messages are announced. |
| status | Partial<Record<state, string>> | Ready, Listening... | Your own status words. |
| still | boolean | false | No breathing or blinking. |
| color | string | --fluid-accent | Colour of the face. |
| children | ReactNode |  | Your input area, below the messages. |

## Colours

| What | How |
|---|---|
| The face | `color` prop: `<Bot color="#ff5a1f" />`. Without it, `--fluid-accent`. |
| Your messages | `--fluid-accent` for the bubble and `--fluid-on-accent` for its text. |
| The bot's messages | `--fluid-surface`, `--fluid-border` and `--fluid-text`. |
| Status line | `--fluid-text-2`. |

Set the variables on any parent to change one bot without touching the others:

```tsx
<div style={{ "--fluid-accent": "#7c3aed", "--fluid-on-accent": "#ffffff" } as React.CSSProperties}>
  <Bot state={state} messages={messages} />
</div>
```

The eyes are holes cut out of the face, so they show the background behind it.

## Keyboard and screen readers

The conversation is a log: new messages are announced with who said them. The status line is announced too.

## Notes

The bot has no input of its own; pass yours as children.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
