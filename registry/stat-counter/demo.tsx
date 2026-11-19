"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { StatCounter } from "./StatCounter";

const days = [
  [12840, 11920],
  [14215, 12840],
  [13380, 14215],
  [16902, 13380],
];

export default function Demo() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((t) => t + 1), 1800);
  const [value, previous] = days[turn % days.length];
  return (
    <StatCounter
      label="Revenue today"
      value={value}
      previous={previous}
      format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
      locale="en-US"
    />
  );
}
