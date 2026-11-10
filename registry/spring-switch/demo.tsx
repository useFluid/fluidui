"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { SpringSwitch } from "./SpringSwitch";

export default function Demo() {
  const [on, setOn] = useState(true);
  useAutoplay(() => setOn((v) => !v), 1100);
  return <SpringSwitch checked={on} onChange={setOn} label="Notifications" />;
}
