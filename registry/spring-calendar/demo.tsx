"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { SpringCalendar } from "./SpringCalendar";

const path = [
  [2026, 10, 4],
  [2026, 10, 12],
  [2026, 10, 27],
  [2026, 11, 3],
  [2026, 11, 18],
  [2026, 10, 18],
];

export default function Demo() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 10, 18));
  const [turn, setTurn] = useState(0);
  useAutoplay(() => {
    const [y, m, d] = path[turn % path.length];
    setValue(new Date(y, m, d));
    setTurn((t) => t + 1);
  }, 1300);
  return <SpringCalendar value={value} onChange={setValue} locale="en-US" />;
}
