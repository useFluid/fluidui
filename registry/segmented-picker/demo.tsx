"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { SegmentedPicker } from "./SegmentedPicker";

const options = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export default function Demo() {
  const [value, setValue] = useState("week");
  const [turn, setTurn] = useState(0);
  useAutoplay(() => {
    setValue(options[[0, 3, 1, 2][turn % 4]].value);
    setTurn((t) => t + 1);
  }, 1000);
  return <SegmentedPicker label="Period" value={value} onChange={setValue} options={options} />;
}
