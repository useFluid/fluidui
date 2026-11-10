"use client";

import { type Mood, Pet } from "../pet/Pet";
import styles from "./Bot.module.css";

export type BotState = "listening" | "thinking" | "talking" | "done";

const MOOD: Record<BotState, Mood> = { listening: "curious", thinking: "surprised", talking: "idle", done: "happy" };
const LOOK: Record<BotState, { x: number; y: number }> = {
  listening: { x: -0.6, y: 0.2 },
  thinking: { x: 0.6, y: -0.8 },
  talking: { x: 0.4, y: 0 },
  done: { x: 0, y: 0 },
};

export type Message = { id: string; from: "person" | "bot"; text: string };

type Props = { state: BotState; messages: Message[]; name?: string };

export function Bot({ state, messages, name = "Assistant" }: Props) {
  return (
    <section className={styles.bot} aria-label={name}>
      <div className={styles.head}>
        <div className={styles.avatar} data-state={state}>
          <Pet mood={MOOD[state]} look={LOOK[state]} />
        </div>
        <div>
          <p className={styles.name}>{name}</p>
          <p className={styles.status} aria-live="polite">
            {state === "thinking" ? "Thinking" : state === "talking" ? "Typing" : state === "listening" ? "Listening" : "Ready"}
          </p>
        </div>
      </div>
      <ol className={styles.messages}>
        {messages.map((m) => (
          <li key={m.id} className={styles.message} data-from={m.from}>
            {m.text}
          </li>
        ))}
        {state === "thinking" && (
          <li className={styles.message} data-from="bot" aria-label="Thinking">
            <span className={styles.dots} aria-hidden><i /><i /><i /></span>
          </li>
        )}
      </ol>
    </section>
  );
}
