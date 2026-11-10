"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { SegmentedPicker } from "../segmented-picker/SegmentedPicker";
import { type Mood, Pet } from "./Pet";

const moods: { value: Mood; label: string }[] = [
  { value: "idle", label: "Calm" },
  { value: "happy", label: "Happy" },
  { value: "surprised", label: "Surprised" },
  { value: "curious", label: "Curious" },
  { value: "sleepy", label: "Sleepy" },
];

export default function Demo() {
  const [mood, setMood] = useState<Mood>("idle");
  const [turn, setTurn] = useState(0);
  useAutoplay(() => {
    setTurn((t) => t + 1);
    setMood(moods[(turn + 1) % moods.length].value);
  }, 1500);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: "100%" }}>
      <div style={{ width: "min(150px, 46cqi)", aspectRatio: "1" }}>
        <Pet mood={mood} follow label="Pet" />
      </div>
      <SegmentedPicker label="Mood" value={mood} onChange={(v) => setMood(v as Mood)} options={moods} />
    </div>
  );
}
