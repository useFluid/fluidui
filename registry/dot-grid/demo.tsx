"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { DotGrid } from "./DotGrid";

const weeks = 16;
const make = (seed: number) =>
  Array.from({ length: weeks * 7 }, (_, i) => Math.max(0, Math.round(50 + 45 * Math.sin(i * 0.37 + seed) * Math.cos(i * 0.11 + seed * 2))));
const sets = [make(0), make(1.7), make(3.1)];

export default function Demo() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((t) => t + 1), 2200);
  return <DotGrid label="Commits" values={sets[turn % sets.length]} max={100} summary="16 weeks of activity" color="#14b8a6" />;
}
