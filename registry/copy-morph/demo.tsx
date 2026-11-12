"use client";

import { useState } from "react";
import { useAutoplay } from "../demo-context";
import { CopyMorph } from "./CopyMorph";

export default function Demo() {
  const [done, setDone] = useState<boolean | undefined>(undefined);
  useAutoplay(() => setDone((d) => !d), 1400);
  return (
    <span style={{ display: "contents" }} onClickCapture={() => setDone(undefined)}>
      <CopyMorph text="npm i @usefluid/motion" done={done} />
    </span>
  );
}
