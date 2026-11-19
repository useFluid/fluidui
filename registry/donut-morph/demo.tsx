"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { DonutMorph } from "./DonutMorph";

const sets = [
  [420, 260, 180, 90],
  [300, 380, 140, 160],
  [520, 200, 260, 60],
];
const names = ["Direct", "Search", "Social", "Email"];

export default function Demo() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((t) => t + 1), 2000);
  const values = sets[turn % sets.length];
  return <DonutMorph label="Visits" parts={names.map((label, i) => ({ label, value: values[i] }))} locale="en-US" />;
}
