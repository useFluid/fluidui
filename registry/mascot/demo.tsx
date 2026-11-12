"use client";

import { useState } from "react";
import type { Mood } from "../pet/Pet";
import { useAutoplay } from "../demo-context";
import { Mascot } from "./Mascot";
import { objects } from "./objects";

const MOODS: Mood[] = ["idle", "happy", "curious", "surprised", "sleepy"];

export default function Demo() {
  const [step, setStep] = useState(0);
  useAutoplay(() => setStep((s) => s + 1), 1400);
  const object = objects[Math.floor(step / 2) % objects.length];
  const mood = MOODS[step % MOODS.length];
  return (
    <button
      type="button"
      onClick={() => setStep((s) => s + 2)}
      aria-label={`${object.name.en}, next mascot`}
      style={{ width: 150, height: 150, padding: 0, border: 0, background: "none", cursor: "pointer" }}
    >
      <Mascot object={object} mood={mood} follow />
    </button>
  );
}
