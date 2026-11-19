"use client";

import { useSpring } from "@usefluid/motion/react";
import { type CSSProperties, useMemo, useRef, useState } from "react";
import { slices } from "./donut";
import styles from "./DonutMorph.module.css";

const R = 48;
const LENGTH = 2 * Math.PI * R;
const GAP = 0.012;
const PALETTE = ["#7c5cff", "#14b8a6", "#ff8a3d", "#ff4d8d", "#3b82f6"];

type Part = { label: string; value: number; color?: string };
type Props = {
  label: string;
  parts: Part[];
  format?: Intl.NumberFormatOptions;
  locale?: string;
};

function Arc({ start, share, index, color }: { start: number; share: number; index: number; color: string }) {
  const arc = useRef<SVGCircleElement>(null);
  useSpring(
    { s: start, l: share },
    ({ s, l }) => {
      if (!arc.current) return;
      const visible = Math.max(0, l - (l > GAP * 2 ? GAP : 0)) * LENGTH;
      arc.current.style.strokeDasharray = `${visible} ${LENGTH}`;
      arc.current.style.strokeDashoffset = `${-s * LENGTH}`;
    },
    { w: Math.max(9, 14 - index * 0.8), z: 0.7 },
  );
  return <circle ref={arc} cx={60} cy={60} r={R} className={styles.arc} style={{ stroke: color }} />;
}

export function DonutMorph({ label, parts, format, locale }: Props) {
  const total = parts.reduce((a, p) => a + Math.max(0, p.value), 0);
  const key = JSON.stringify(format ?? {});
  const number = useMemo(() => new Intl.NumberFormat(locale, JSON.parse(key)), [locale, key]);
  const percent = useMemo(() => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }), [locale]);
  const out = useRef<HTMLSpanElement>(null);
  const [first] = useState(() => number.format(total));
  useSpring(
    { v: total },
    ({ v }) => {
      if (out.current) out.current.textContent = number.format(Math.round(v));
    },
    { w: 9, z: 1 },
  );
  const cut = slices(parts.map((p) => p.value));
  const colorOf = (p: Part, i: number) => p.color ?? PALETTE[i % PALETTE.length];

  return (
    <figure className={styles.root} aria-label={label}>
      <div className={styles.ring}>
        <svg viewBox="0 0 120 120" aria-hidden>
          <circle cx={60} cy={60} r={R} className={styles.track} />
          {parts.map((p, i) => (
            <Arc key={p.label} start={cut[i].start} share={cut[i].share} index={i} color={colorOf(p, i)} />
          ))}
        </svg>
        <span className={styles.center} aria-hidden>
          <span ref={out} className={styles.total}>
            {first}
          </span>
          <span className={styles.caption}>{label}</span>
        </span>
      </div>
      <ul className={styles.legend}>
        {parts.map((p, i) => (
          <li key={p.label} style={{ "--part": colorOf(p, i) } as CSSProperties}>
            <span className={styles.name}>{p.label}</span>
            <span className={styles.share}>{percent.format(cut[i].share)}</span>
            <span className={styles.hidden}>{number.format(p.value)}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
