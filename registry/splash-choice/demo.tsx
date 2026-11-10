"use client";

import type { CSSProperties } from "react";
import { shapes } from "@usefluid/motion";
import { useState } from "react";
import { useAutoplay, useDemo } from "../demo-context";
import { type Option, SplashChoice } from "./SplashChoice";

const options: Option[] = [
  { value: "shops", label: "Shops", word: "shops.", shape: shapes.square },
  { value: "apps", label: "Apps", word: "apps.", shape: shapes.capsule },
  { value: "brands", label: "Brands", word: "brands.", shape: shapes.flower },
];

export default function Demo() {
  const { logo, play } = useDemo();
  const [value, setValue] = useState<string | null>(null);
  const [turn, setTurn] = useState(0);

  useAutoplay(() => {
    setTurn((t) => t + 1);
    if (turn < 4) return;
    setValue(options[(turn - 4) % options.length].value);
  }, 900);

  return (
    <div style={{ position: "absolute", inset: 0, "--fluid-splash-height": "100%" } as CSSProperties}>
      <SplashChoice logo={logo} title="Made for" word="you." options={options} value={value} onChange={setValue} play={play} skippable={false} />
    </div>
  );
}
