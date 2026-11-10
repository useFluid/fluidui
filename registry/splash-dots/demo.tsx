"use client";

import type { CSSProperties } from "react";
import { useDemo } from "../demo-context";
import { SplashDots } from "./SplashDots";

export default function Demo() {
  const { logo, name, play } = useDemo();
  return (
    <div style={{ position: "absolute", inset: 0, "--fluid-splash-height": "100%" } as CSSProperties}>
      <SplashDots logo={logo} name={name} play={play} skippable={false} />
    </div>
  );
}
