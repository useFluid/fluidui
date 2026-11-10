"use client";

import { useEffect, useState } from "react";
import { useAutoplay } from "../demo-context";
import { MorphButton, type MorphButtonState } from "./MorphButton";

const NEXT: Record<MorphButtonState, MorphButtonState> = { idle: "loading", loading: "done", done: "idle" };

export default function Demo() {
  const [state, setState] = useState<MorphButtonState>("idle");
  useAutoplay(() => setState((s) => NEXT[s]), 1500);

  const [clicked, setClicked] = useState(0);
  useEffect(() => {
    if (!clicked) return;
    const timer = setTimeout(() => setState("done"), 1600);
    return () => clearTimeout(timer);
  }, [clicked]);

  return (
    <MorphButton
      state={state}
      labels={{ idle: "Send order", done: "Order sent" }}
      onClick={() => {
        if (state === "loading") return;
        if (state === "done") return setState("idle");
        setState("loading");
        setClicked((c) => c + 1);
      }}
    />
  );
}
