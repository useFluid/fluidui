"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { MorphIsland } from "./MorphIsland";

export default function Demo() {
  const [open, setOpen] = useState(false);
  useAutoplay(() => setOpen((o) => !o), 1800);
  return (
    <MorphIsland label="New order" width={270} height={150} open={open} onOpenChange={setOpen}>
      Order 214 is ready to go. Let the customer know now?
    </MorphIsland>
  );
}
