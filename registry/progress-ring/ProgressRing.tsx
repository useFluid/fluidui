"use client";

import { useSpring } from "@usefluid/motion/react";
import { useMemo, useRef, useState } from "react";
import styles from "./ProgressRing.module.css";

const R = 52;
const LENGTH = 2 * Math.PI * R;
const FILL = { w: 8, z: 0.72 };

type Props = {
  label: string;
  value: number;
  max?: number;
  size?: number;
  locale?: string;
  color?: string;
};

export function ProgressRing({ label, value, max = 100, size = 168, locale, color }: Props) {
  const arc = useRef<SVGCircleElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const percent = useMemo(() => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }), [locale]);
  const share = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const [first] = useState(() => percent.format(share));

  useSpring(
    { s: share },
    ({ s }) => {
      const shown = Math.min(1.04, Math.max(0, s));
      if (arc.current) arc.current.style.strokeDashoffset = `${LENGTH * (1 - shown)}`;
      if (out.current) out.current.textContent = percent.format(Math.min(1, Math.max(0, s)));
    },
    FILL,
  );

  return (
    <div
      className={styles.root}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(max, Math.max(0, value))}
      data-done={share >= 1 ? "" : undefined}
      style={{ width: size, ...(color ? { "--fluid-accent": color, "--fluid-on-accent": "#ffffff" } : {}) }}
    >
      <svg viewBox="0 0 120 120" className={styles.ring} aria-hidden>
        <circle cx={60} cy={60} r={R} className={styles.track} />
        <circle ref={arc} cx={60} cy={60} r={R} className={styles.arc} strokeDasharray={LENGTH} strokeDashoffset={LENGTH * (1 - share)} />
      </svg>
      <span className={styles.center} aria-hidden>
        <span ref={out} className={styles.value}>
          {first}
        </span>
        <span className={styles.label}>{label}</span>
      </span>
    </div>
  );
}
