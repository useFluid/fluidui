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
| children | ReactNode |  | Your input area, below the messages. |

## Keyboard and screen readers

The conversation is a log: new messages are announced with who said them. The status line is announced too.

## Notes

The bot has no input of its own; pass yours as children.

Every colour comes from the `--fluid-*` variables, and the piece is yours to change.
