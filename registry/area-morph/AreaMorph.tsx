"use client";

import { MorphPath } from "@usefluid/motion/react";
import { useId } from "react";
import { areaPath } from "./area";
import styles from "./AreaMorph.module.css";

const FLOW = { w: 11, z: 0.72, spread: 0.35 };

type Props = {
  label: string;
  values: number[];
  max?: number;
  labels?: string[];
};

export function AreaMorph({ label, values, max, labels }: Props) {
  const gradient = `fluid-area-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const d = areaPath(values, max);
  return (
    <figure className={styles.root}>
      <svg viewBox="0 0 120 120" preserveAspectRatio="none" className={styles.chart} role="img" aria-label={`${label}: ${values.join(", ")}`}>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--fluid-accent)" }} />
            <stop offset="1" style={{ stopColor: "var(--fluid-accent)", stopOpacity: 0.12 }} />
          </linearGradient>
        </defs>
        <MorphPath d={d} fill={`url(#${gradient})`} config={FLOW} />
      </svg>
      {labels && (
        <div className={styles.axis} aria-hidden>
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </figure>
  );
}
