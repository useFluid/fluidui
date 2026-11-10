"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { MenuMorph } from "./MenuMorph";

export default function Demo() {
  const [open, setOpen] = useState(false);
  useAutoplay(() => setOpen((o) => !o), 1900);
  return (
    <MenuMorph
      open={open}
      onOpenChange={setOpen}
      items={[{ label: "Home" }, { label: "Orders" }, { label: "My account" }]}
    />
  );
}
