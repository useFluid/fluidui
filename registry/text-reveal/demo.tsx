"use client";

import { useDemo } from "../demo-context";
import { TextReveal } from "./TextReveal";

export default function Demo() {
  const { play } = useDemo();
  return (
    <p style={{ margin: 0, maxWidth: 340, fontFamily: "var(--fluid-font)", fontSize: "clamp(26px, 9cqi, 40px)", lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--fluid-text)", textAlign: "center" }}>
      <TextReveal text="Every letter arrives in its own time." play={play} />
    </p>
  );
}
