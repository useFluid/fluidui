"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { ProgressRing } from "./ProgressRing";

const steps = [18, 46, 73, 100, 62];

export default function Demo() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((t) => t + 1), 1600);
  return <ProgressRing label="Monthly goal" value={steps[turn % steps.length]} />;
}
