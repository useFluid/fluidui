"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { RankList } from "./RankList";

const rounds = [
  [420, 380, 310, 260, 190],
  [430, 512, 318, 260, 240],
  [470, 530, 480, 300, 250],
  [520, 540, 490, 560, 260],
  [610, 560, 500, 570, 590],
];
const people = ["Ana", "Bruno", "Carla", "Diego", "Elisa"];

export default function Demo() {
  const [turn, setTurn] = useState(0);
  useAutoplay(() => setTurn((t) => t + 1), 1700);
  const values = rounds[turn % rounds.length];
  const items = people.map((label, i) => ({ id: label, label, value: values[i] }));
  return <RankList label="Sales this month" items={items} />;
}
