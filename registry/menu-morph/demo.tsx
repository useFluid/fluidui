"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { MenuMorph } from "./MenuMorph";

const line = (width: string) => (
  <span style={{ display: "block", width, height: 10, borderRadius: 999, background: "color-mix(in srgb, var(--fluid-text) 12%, transparent)" }} />
);

export default function Demo() {
  const [open, setOpen] = useState(false);
  useAutoplay(() => setOpen((o) => !o), 1900);
  return (
    <div
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: "min(100%, 360px)",
        height: 300,
        padding: 14,
        borderRadius: 26,
        background: "color-mix(in srgb, var(--fluid-text) 5%, transparent)",
        boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--fluid-text) 10%, transparent)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48 }}>
        <strong style={{ paddingLeft: 6, color: "var(--fluid-text)", font: "600 16px/1 var(--fluid-font)" }}>Orbe</strong>
        <MenuMorph
          open={open}
          onOpenChange={setOpen}
          title="Orbe"
          width={268}
          items={[{ label: "Home", current: true }, { label: "Orders" }, { label: "My account" }]}
        />
      </div>
      <div style={{ display: "grid", gap: 10, padding: "22px 6px 0" }}>
        {line("70%")}
        {line("90%")}
        {line("55%")}
      </div>
    </div>
  );
}
