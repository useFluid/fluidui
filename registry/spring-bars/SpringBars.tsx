"use client";

import { useSpring } from "@usefluid/motion/react";
import { type KeyboardEvent, useMemo, useRef, useState } from "react";
import styles from "./SpringBars.module.css";

type Datum = { label: string; value: number };
type Props = {
  label: string;
  data: Datum[];
  max?: number;
  format?: Intl.NumberFormatOptions;
  locale?: string;
};

function Bar({ share, index }: { share: number; index: number }) {
  const fill = useRef<HTMLSpanElement>(null);
  useSpring(
    { h: share },
    ({ h }) => {
      if (fill.current) fill.current.style.height = `${Math.max(0, h) * 100}%`;
    },
    { w: Math.max(9, 15 - index * 0.45), z: 0.6 },
  );
  return <span ref={fill} className={styles.fill} />;
}

export function SpringBars({ label, data, max, format, locale }: Props) {
  const plot = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(data.length - 1);
  const key = JSON.stringify(format ?? {});
  const number = useMemo(() => new Intl.NumberFormat(locale, JSON.parse(key)), [locale, key]);
  const top = max ?? Math.max(1, ...data.map((d) => d.value));
  const current = Math.min(active, data.length - 1);
  const shareOf = (v: number) => Math.min(1, Math.max(0, v / top));

  useSpring(
    { x: data.length ? (current + 0.5) / data.length : 0.5, y: data.length ? shareOf(data[current].value) : 0 },
    ({ x, y }) => {
      if (!bubble.current) return;
      bubble.current.style.left = `${x * 100}%`;
      bubble.current.style.bottom = `${y * 100}%`;
    },
    { w: 16, z: 0.72 },
  );

  const move = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? data.length - 1 : -1;
    if (next < 0 || next >= data.length) return;
    e.preventDefault();
    setActive(next);
    plot.current?.querySelectorAll<HTMLElement>("button")[next]?.focus();
  };

  return (
    <figure className={styles.root} aria-label={label}>
      <div ref={plot} className={styles.plot} role="group" aria-label={label}>
        {data.map((d, i) => (
          <button
            key={d.label}
            type="button"
            className={styles.column}
            data-active={i === current ? "" : undefined}
            tabIndex={i === current ? 0 : -1}
            aria-label={`${d.label}: ${number.format(d.value)}`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => move(e, i)}
          >
            <Bar share={shareOf(d.value)} index={i} />
          </button>
        ))}
        {data.length > 0 && (
          <span ref={bubble} className={styles.bubble} aria-hidden>
            {number.format(data[current].value)}
          </span>
        )}
      </div>
      <div className={styles.axis} aria-hidden>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </figure>
  );
}
