"use client";

import { useDemo } from "../demo-context";
import { WordCycle } from "./WordCycle";

export default function Demo() {
  const { play, auto } = useDemo();
  return (
    <p style={{ margin: 0, fontFamily: "var(--fluid-font)", fontSize: "clamp(26px, 9cqi, 44px)", lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.035em", color: "var(--fluid-text)", textAlign: "center" }}>
      Made for <br />
      <span style={{ color: "var(--fluid-accent)" }}>
        <WordCycle words={["shops.", "clinics.", "schools.", "you."]} every={1.3} play={play && auto} />
      </span>
    </p>
  );
}
