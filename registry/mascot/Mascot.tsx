"use client";

import type { CSSProperties } from "react";
import { type Mood, Pet } from "../pet/Pet";
import { type MascotObject, objects } from "./objects";
import styles from "./Mascot.module.css";

type Props = {
  object: string | MascotObject;
  mood?: Mood;
  color?: string;
  follow?: boolean;
  look?: { x: number; y: number };
  still?: boolean;
  label?: string;
  className?: string;
};

export function Mascot({ object, mood = "idle", color, follow = false, look, still = false, label, className }: Props) {
  const o = typeof object === "string" ? (objects.find((x) => x.id === object) ?? objects[0]) : object;
  return (
    <span
      className={[styles.mascot, className].filter(Boolean).join(" ")}
      style={{ "--mascot-color": color ?? o.color } as CSSProperties}
    >
      <Pet shape={o.d} eyes={o.eyes} mood={mood} follow={follow} look={look} still={still} label={label} />
    </span>
  );
}
