"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { IconMorph, icons } from "./IconMorph";

const pairs = [
  { off: icons.menu, on: icons.close, label: "Menu" },
  { off: icons.play, on: icons.pause, label: "Play" },
  { off: icons.plus, on: icons.check, label: "Add" },
];

export default function Demo() {
  const [state, setState] = useState([false, false, false]);
  const [turn, setTurn] = useState(0);
  useAutoplay(() => {
    setState((s) => s.map((v, i) => (i === turn % 3 ? !v : v)));
    setTurn((t) => t + 1);
  }, 700);
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {pairs.map((p, i) => (
        <IconMorph
          key={p.label}
          on={state[i]}
          off={p.off}
          onIcon={p.on}
          label={p.label}
          onClick={() => setState((s) => s.map((v, j) => (j === i ? !v : v)))}
        />
      ))}
    </div>
  );
}
