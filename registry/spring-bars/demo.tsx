"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { SpringBars } from "./SpringBars";

const weeks = [
  [32, 48, 41, 66, 58, 80, 72],
  [54, 38, 70, 52, 88, 61, 46],
  [28, 64, 50, 44, 76, 92, 84],
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Demo() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((t) => t + 1), 1900);
  const data = days.map((label, i) => ({ label, value: weeks[turn % weeks.length][i] }));
  return <SpringBars label="Orders this week" data={data} max={100} />;
}
