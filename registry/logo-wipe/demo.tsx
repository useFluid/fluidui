"use client";

import { useState } from "react";
import { useAutoplay, useDemo } from "../demo-context";
import { SegmentedPicker } from "../segmented-picker/SegmentedPicker";
import { LogoWipe } from "./LogoWipe";

const screens: Record<string, [string, string]> = {
  a: ["Home", "Everything that matters today."],
  b: ["Orders", "12 orders waiting for a reply."],
  c: ["Customers", "3 new customers this week."],
};
const keys = Object.keys(screens);

export default function Demo() {
  const { logo } = useDemo();
  const [view, setView] = useState("a");
  useAutoplay(() => setView((v) => keys[(keys.indexOf(v) + 1) % keys.length]), 2000);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 320 }}>
      <div style={{ width: "100%", height: 130, borderRadius: "var(--fluid-radius)", overflow: "hidden", border: "1px solid var(--fluid-border)", background: "var(--fluid-surface)" }}>
        <LogoWipe logo={logo} view={view}>
          <div style={{ height: 130, padding: 18, fontFamily: "var(--fluid-font)", color: "var(--fluid-text)" }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.03em" }}>{screens[view][0]}</p>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--fluid-text-2)" }}>{screens[view][1]}</p>
          </div>
        </LogoWipe>
      </div>
      <SegmentedPicker
        label="Screen"
        value={view}
        onChange={setView}
        options={Object.entries(screens).map(([value, [label]]) => ({ value, label }))}
      />
    </div>
  );
}
