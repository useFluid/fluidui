"use client";

import { useDemo } from "../demo-context";
import { ShapeMorph } from "./ShapeMorph";

export default function Demo() {
  const { logo, play, name } = useDemo();
  return (
    <div style={{ width: "min(170px, 60cqi)", aspectRatio: "1", color: "var(--fluid-accent)" }}>
      <ShapeMorph logo={logo} play={play} label={`${name} logo`} />
    </div>
  );
}
