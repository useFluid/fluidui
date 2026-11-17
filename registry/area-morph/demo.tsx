"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { AreaMorph } from "./AreaMorph";

const ranges = [
  [20, 34, 28, 52, 46, 70, 64, 88],
  [60, 42, 55, 38, 72, 50, 84, 76],
  [12, 18, 40, 36, 62, 58, 80, 96],
];

export default function Demo() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((t) => t + 1), 2000);
  return <AreaMorph label="Visitors" values={ranges[turn % ranges.length]} max={100} labels={["Jan", "Mar", "May", "Jul", "Sep", "Nov"]} />;
}
