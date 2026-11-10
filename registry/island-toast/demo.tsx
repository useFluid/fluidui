"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { SpringButton } from "../spring-button/SpringButton";
import { IslandToast } from "./IslandToast";

const messages = ["Order sent", "Payment confirmed", "Customer notified"];

const check = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5 9-10" />
  </svg>
);

export default function Demo() {
  const [message, setMessage] = useState<string | null>(null);
  const [turn, setTurn] = useState(0);
  const send = () => {
    setMessage(messages[turn % messages.length]);
    setTurn((t) => t + 1);
  };
  useAutoplay(() => (message ? setMessage(null) : send()), 1300);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "min(100%, 360px)" }}>
      <IslandToast message={message} icon={check} />
      <SpringButton variant="quiet" onClick={() => (message ? setMessage(null) : send())}>
        {message ? "Close notice" : "Send notice"}
      </SpringButton>
    </div>
  );
}
