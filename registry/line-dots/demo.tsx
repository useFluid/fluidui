"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { LineDots } from "./LineDots";

const sets = [
  [24, 38, 31, 56, 49, 72, 66, 84],
  [52, 40, 61, 47, 78, 58, 88, 74],
  [16, 30, 48, 42, 64, 60, 82, 96],
];
const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export default function Demo() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((t) => t + 1), 2000);
  return <LineDots label="Signups" values={sets[turn % sets.length]} labels={labels} max={100} color="#7c5cff" />;
}
