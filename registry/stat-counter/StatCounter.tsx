"use client";

import { MorphPath, useSpring } from "@usefluid/motion/react";
import { type CSSProperties, useMemo, useRef, useState } from "react";
import styles from "./StatCounter.module.css";

const UP = "M60 18L102 64H74V102H46V64H18Z";
const DOWN = "M60 102L18 56H46V18H74V56H102Z";
const ROLL = { w: 9, z: 1 };
const tint = (color?: string) => (color ? ({ "--fluid-accent": color, "--fluid-on-accent": "#ffffff" } as CSSProperties) : undefined);

const roundLike = (v: number, target: number) => Number(v.toFixed(Math.min(6, (String(target).split(".")[1] ?? "").length)));

type Props = {
  label: string;
  value: number;
  previous?: number;
  format?: Intl.NumberFormatOptions;
  locale?: string;
  upIsGood?: boolean;
  color?: string;
};

export function StatCounter({ label, value, previous, format, locale, upIsGood = true, color }: Props) {
  const out = useRef<HTMLSpanElement>(null);
  const key = JSON.stringify(format ?? {});
  const number = useMemo(() => new Intl.NumberFormat(locale, JSON.parse(key)), [locale, key]);
  const percent = useMemo(() => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }), [locale]);
  const [first] = useState(() => number.format(value));

  useSpring(
    { v: value },
    ({ v }) => {
      if (out.current) out.current.textContent = number.format(roundLike(v, value));
    },
    ROLL,
  );

  const change = previous === undefined || previous === 0 ? null : (value - previous) / Math.abs(previous);
  const up = change !== null && change >= 0;
  const good = up === upIsGood;

  return (
    <div className={styles.card} style={tint(color)}>
      <span className={styles.label}>{label}</span>
      <span ref={out} className={styles.value} aria-hidden>
        {first}
      </span>
      <span className={styles.hidden}>{number.format(value)}</span>
      {change !== null && (
        <span className={styles.delta} data-good={good ? "" : undefined}>
          <svg viewBox="0 0 120 120" width={12} height={12} aria-hidden>
            <MorphPath d={up ? UP : DOWN} fill="currentColor" config={{ w: 18, z: 0.62 }} />
          </svg>
          <span className={styles.hidden}>{up ? "up" : "down"}</span>
          {percent.format(Math.abs(change))}
        </span>
      )}
    </div>
  );
}
