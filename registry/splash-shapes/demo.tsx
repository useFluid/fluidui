"use client";

import type { CSSProperties } from "react";
import { useDemo } from "../demo-context";
import { SplashShapes } from "./SplashShapes";

export default function Demo() {
  const { logo, play } = useDemo();
  return (
    <div style={{ position: "absolute", inset: 0, "--fluid-splash-height": "100%" } as CSSProperties}>
      <SplashShapes
        logo={logo}
        title="From idea,"
        words={["to brand.", "to site.", "to video.", "to product."]}
        action="Get started"
        play={play}
        skippable={false}
      />
    </div>
  );
}
