"use client";

import type { ReactNode } from "react";
import { type Mood, Pet } from "../pet/Pet";
import styles from "./Bot.module.css";

export type BotState = "idle" | "listening" | "thinking" | "talking" | "done";

const MOOD: Record<BotState, Mood> = { idle: "idle", listening: "curious", thinking: "idle", talking: "idle", done: "happy" };
const LOOK: Record<BotState, { x: number; y: number }> = {
  idle: { x: 0, y: 0 },
  listening: { x: -0.6, y: 0.4 },
  thinking: { x: 0.6, y: -0.8 },
  talking: { x: 0.4, y: 0 },
  done: { x: 0, y: 0 },
};
const STATUS: Record<BotState, string> = { idle: "Ready", listening: "Listening", thinking: "Thinking", talking: "Answering", done: "Ready" };

export type Message = { id: string; from: "person" | "bot"; text: string };

type Props = {
  state: BotState;
  messages: Message[];
  name?: string;
  you?: string;
  status?: Partial<Record<BotState, string>>;
  still?: boolean;
  children?: ReactNode;
};

export function Bot({ state, messages, name = "Assistant", you = "You", status, still = false, children }: Props) {
  const label = { ...STATUS, ...status }[state];
  return (
    <section className={styles.bot} aria-label={name}>
      <div className={styles.head}>
        <div className={styles.avatar} data-state={state}>
          <Pet mood={MOOD[state]} look={LOOK[state]} still={still} />
        </div>
        <div>
          <p className={styles.name}>{name}</p>
          <p className={styles.status} aria-live="polite">{label}</p>
        </div>
      </div>
      <ol className={styles.messages} role="log" aria-live="polite">
        {messages.map((m) => (
          <li key={m.id} className={styles.message} data-from={m.from}>
            <span className={styles.srOnly}>{m.from === "person" ? you : name}: </span>
            {m.text}
          </li>
        ))}
        {state === "thinking" && (
          <li className={styles.message} data-from="bot" aria-hidden>
            <span className={styles.dots}><i /><i /><i /></span>
          </li>
        )}
      </ol>
      {children}
    </section>
  );
}
