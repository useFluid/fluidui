"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { Dashboard, type Range } from "./Dashboard";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const money = { style: "currency", currency: "USD", maximumFractionDigits: 0 } as const;
const people = (values: number[]) => ["Ana", "Bruno", "Carla", "Diego"].map((label, i) => ({ id: label, label, value: values[i] }));

const ranges: Range[] = [
  {
    id: "week",
    label: "Week",
    stats: [
      { label: "Revenue", value: 18420, previous: 16100, format: money },
      { label: "Orders", value: 342, previous: 365 },
      { label: "Refunds", value: 12, previous: 18, upIsGood: false },
    ],
    trend: [22, 30, 26, 44, 40, 58, 54],
    trendMax: 100,
    trendLabels: ["Mon", "Wed", "Fri", "Sun"],
    bars: DAYS.map((label, i) => ({ label, value: [32, 48, 41, 66, 58, 80, 72][i] })),
    barsMax: 100,
    goal: { label: "Weekly goal", value: 64, max: 100 },
    leaders: people([42, 38, 51, 29]),
  },
  {
    id: "month",
    label: "Month",
    stats: [
      { label: "Revenue", value: 76980, previous: 70210, format: money },
      { label: "Orders", value: 1490, previous: 1322 },
      { label: "Refunds", value: 41, previous: 37, upIsGood: false },
    ],
    trend: [40, 34, 52, 48, 66, 60, 78],
    trendMax: 100,
    trendLabels: ["W1", "W2", "W3", "W4"],
    bars: DAYS.map((label, i) => ({ label, value: [54, 62, 70, 52, 88, 61, 46][i] })),
    barsMax: 100,
    goal: { label: "Monthly goal", value: 88, max: 100 },
    leaders: people([180, 214, 196, 150]),
  },
  {
    id: "year",
    label: "Year",
    stats: [
      { label: "Revenue", value: 912400, previous: 744000, format: money },
      { label: "Orders", value: 17820, previous: 15040 },
      { label: "Refunds", value: 402, previous: 455, upIsGood: false },
    ],
    trend: [18, 26, 38, 34, 56, 72, 94],
    trendMax: 100,
    trendLabels: ["Q1", "Q2", "Q3", "Q4"],
    bars: DAYS.map((label, i) => ({ label, value: [28, 64, 50, 44, 76, 92, 84][i] })),
    barsMax: 100,
    goal: { label: "Yearly goal", value: 100, max: 100 },
    leaders: people([2210, 2480, 1990, 2620]),
  },
];

export default function Demo() {
  const [value, setValue] = useState("week");
  const [turn, setTurn] = useState(0);
  useAutoplay(() => {
    setTurn((t) => t + 1);
    setValue(ranges[(turn + 1) % ranges.length].id);
  }, 2600);
  return <Dashboard title="Store" ranges={ranges} value={value} onChange={setValue} locale="en-US" />;
}
