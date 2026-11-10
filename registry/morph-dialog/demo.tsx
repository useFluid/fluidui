"use client";

import { useRef, useState } from "react";
import { useAutoplay } from "../demo-context";
import { MorphDialog } from "./MorphDialog";

const cards = [
  { title: "Order 2041", text: "Shipped today. It arrives on Thursday." },
  { title: "Invite", text: "Your team wants you on the new project." },
  { title: "Plan", text: "Pro, renews on the 12th of next month." },
];

const card = {
  minWidth: 0,
  minHeight: 64,
  padding: "0 16px",
  border: 0,
  borderRadius: "calc(var(--fluid-radius) * 1.4)",
  background: "var(--fluid-surface)",
  color: "var(--fluid-text)",
  font: "600 14px/1.2 var(--fluid-font)",
  cursor: "pointer",
} as const;

export default function Demo() {
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useAutoplay(() => {
    if (open === null) {
      const next = (shown + 1) % cards.length;
      setShown(next);
      setOpen(next);
    } else setOpen(null);
  }, 1400);
  const c = cards[shown];
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, width: "min(100%, 420px)" }}>
        {cards.map((item, i) => (
          <button
            key={item.title}
            ref={(el) => { buttons.current[i] = el; }}
            type="button"
            style={card}
            onClick={() => { setShown(i); setOpen(i); }}
          >
            {item.title}
          </button>
        ))}
      </div>
      <MorphDialog
        contained
        open={open !== null}
        onClose={() => setOpen(null)}
        from={buttons.current[shown]}
        labelledBy="morph-dialog-title"
        style={{ width: "min(100%, 340px)", padding: 22, gap: 10 }}
      >
        <h3 id="morph-dialog-title" style={{ margin: 0, fontSize: 22, letterSpacing: "-0.03em" }}>{c.title}</h3>
        <p style={{ margin: "0 0 12px", color: "var(--fluid-text-2)" }}>{c.text}</p>
        <button
          type="button"
          onClick={() => setOpen(null)}
          style={{ ...card, minHeight: 44, borderRadius: 999, background: "var(--fluid-accent)", color: "var(--fluid-on-accent)" }}
        >
          Close
        </button>
      </MorphDialog>
    </div>
  );
}
