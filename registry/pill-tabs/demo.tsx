"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { PillTabs } from "./PillTabs";

const tabs = [
  { value: "all", label: "All", count: 24 },
  { value: "open", label: "Open", count: 8 },
  { value: "paid", label: "Paid", count: 13 },
  { value: "shipped", label: "Shipped", count: 3 },
];

export default function Demo() {
  const [value, setValue] = useState("open");
  const [turn, setTurn] = useState(0);
  useAutoplay(() => {
    setValue(tabs[[0, 3, 1, 2][turn % 4]].value);
    setTurn((t) => t + 1);
  }, 1100);
  return <PillTabs label="Orders" tabs={tabs} value={value} onChange={setValue} />;
}
