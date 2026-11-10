"use client";

import { useEffect, useState } from "react";
import { useAutoplay, useDemo } from "../demo-context";
import { MorphLoader } from "./MorphLoader";

export default function Demo() {
  const [done, setDone] = useState(false);
  const { auto } = useDemo();
  useAutoplay(() => setDone((d) => !d), 2200);
  useEffect(() => {
    if (!auto) setDone(true);
  }, [auto]);
  return (
    <button
      type="button"
      onClick={() => setDone((d) => !d)}
      aria-label={done ? "Load again" : "Finish"}
      style={{ border: 0, background: "none", padding: 8, borderRadius: 16, cursor: "pointer", color: "inherit" }}
    >
      <MorphLoader done={done} />
    </button>
  );
}
