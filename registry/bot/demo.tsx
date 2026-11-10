"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { Bot, type BotState, type Message } from "./Bot";

const SCRIPT: { state: BotState; add?: Message }[] = [
  { state: "listening", add: { id: "1", from: "person", text: "Has my order shipped?" } },
  { state: "thinking" },
  { state: "talking", add: { id: "2", from: "bot", text: "It just left. It arrives tomorrow by 6 pm." } },
  { state: "done" },
  { state: "listening", add: { id: "3", from: "person", text: "Thanks!" } },
  { state: "done", add: { id: "4", from: "bot", text: "Anytime. Just call if you need anything." } },
];

export default function Demo() {
  const [step, setStep] = useState(0);
  useAutoplay(() => setStep((s) => (s + 1) % (SCRIPT.length + 1)), 1300);
  const shown = SCRIPT.slice(0, step + 1);
  const messages = shown.flatMap((s) => (s.add ? [s.add] : []));
  const state = shown[shown.length - 1]?.state ?? "listening";
  return <Bot state={state} messages={messages} name="Help" />;
}
