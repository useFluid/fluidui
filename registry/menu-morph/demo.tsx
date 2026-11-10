"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { MenuMorph } from "./MenuMorph";

export default function Demo() {
  const [open, setOpen] = useState(false);
  useAutoplay(() => setOpen((o) => !o), 1900);
  return (
    <div style={{ position: "absolute", top: 20, right: 20 }}>
      <MenuMorph
        open={open}
        onOpenChange={setOpen}
        title="Orbe"
        items={[{ label: "Home" }, { label: "Orders" }, { label: "Messages" }, { label: "My account" }]}
      />
    </div>
  );
}
