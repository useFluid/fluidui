"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { SpringButton } from "./SpringButton";

export default function Demo() {
  const [pressed, setPressed] = useState<number | null>(null);
  const [turn, setTurn] = useState(0);
  useAutoplay(() => {
    setPressed(turn % 2);
    setTurn((t) => t + 1);
    setTimeout(() => setPressed(null), 180);
  }, 900);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      <SpringButton pressed={pressed === 0 || undefined}>Save</SpringButton>
      <SpringButton variant="quiet" pressed={pressed === 1 || undefined}>Cancel</SpringButton>
    </div>
  );
}
