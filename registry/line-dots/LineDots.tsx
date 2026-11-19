"use client";

import { useSpring } from "@usefluid/motion/react";
import { type CSSProperties, type KeyboardEvent, type RefObject, useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { linePath, pointsOf } from "./line";
import styles from "./LineDots.module.css";

const H = 180;

type Props = {
  label: string;
  values: number[];
  labels: string[];
  max?: number;
  format?: Intl.NumberFormatOptions;
  locale?: string;
  color?: string;
};

function Dot({
  i,
  value,
  live,
  paint,
  dot,
}: {
  i: number;
  value: number;
  live: RefObject<number[]>;
  paint(): void;
  dot: (el: SVGCircleElement | null) => void;
}) {
  useSpring(
    { v: value },
    ({ v }) => {
      live.current[i] = v;
      paint();
    },
    { w: Math.max(9, 16 - i * 0.5), z: 0.62 },
  );
  return <circle ref={dot} r={5} className={styles.dot} />;
}

export function LineDots({ label, values, labels, max, format, locale, color }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const area = useRef<SVGPathElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const live = useRef<number[]>([...values]);
  const at = useRef(values.length - 1);
  const [width, setWidth] = useState(400);
  const widthRef = useRef(width);
  const [active, setActive] = useState(values.length - 1);
  const gradient = `fluid-line-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const key = JSON.stringify(format ?? {});
  const number = useMemo(() => new Intl.NumberFormat(locale, JSON.parse(key)), [locale, key]);
  const top = max ?? Math.max(1, ...values);
  const current = Math.min(active, values.length - 1);

  const paint = useCallback(() => {
    const w = widthRef.current;
    const pts = pointsOf(live.current.slice(0, values.length), top, w, H);
    if (!pts.length) return;
    const d = linePath(pts);
    line.current?.setAttribute("d", d);
    area.current?.setAttribute("d", `${d}L${pts[pts.length - 1].x} ${H}L${pts[0].x} ${H}Z`);
    pts.forEach((p, i) => {
      dots.current[i]?.setAttribute("cx", `${p.x}`);
      dots.current[i]?.setAttribute("cy", `${p.y}`);
    });
    if (bubble.current) {
      const f = Math.min(pts.length - 1, Math.max(0, at.current));
      const a = pts[Math.floor(f)];
      const b = pts[Math.ceil(f)];
      const t = f - Math.floor(f);
      bubble.current.style.transform = `translate(${a.x + (b.x - a.x) * t}px, ${a.y + (b.y - a.y) * t}px)`;
    }
  }, [top, values.length]);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      widthRef.current = el.clientWidth || 400;
      setWidth(widthRef.current);
      paint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [paint]);

  useSpring(
    { i: current },
    ({ i }) => {
      at.current = i;
      paint();
    },
    { w: 16, z: 0.75 },
  );

  const move = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? values.length - 1 : -1;
    if (next < 0 || next >= values.length) return;
    e.preventDefault();
    setActive(next);
    box.current?.querySelectorAll<HTMLElement>("button")[next]?.focus();
  };

  return (
    <figure className={styles.root} style={color ? ({ "--fluid-accent": color, "--fluid-on-accent": "#ffffff" } as CSSProperties) : undefined}>
      <div ref={box} className={styles.plot} role="group" aria-label={label}>
        <svg viewBox={`0 0 ${width} ${H}`} className={styles.chart} aria-hidden>
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--fluid-accent)", stopOpacity: 0.28 }} />
              <stop offset="1" style={{ stopColor: "var(--fluid-accent)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path ref={area} fill={`url(#${gradient})`} />
          <path ref={line} className={styles.line} />
          {values.map((v, i) => (
            <Dot
              key={labels[i] ?? i}
              i={i}
              value={v}
              live={live}
              paint={paint}
              dot={(el) => {
                dots.current[i] = el;
              }}
            />
          ))}
        </svg>
        <span ref={bubble} className={styles.bubble} aria-hidden>
          <span>{values.length ? number.format(values[current]) : ""}</span>
        </span>
        <div className={styles.hits}>
          {values.map((v, i) => (
            <button
              key={labels[i] ?? i}
              type="button"
              className={styles.hit}
              data-active={i === current ? "" : undefined}
              tabIndex={i === current ? 0 : -1}
              aria-label={`${labels[i] ?? i + 1}: ${number.format(v)}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onKeyDown={(e) => move(e, i)}
            />
          ))}
        </div>
      </div>
      <div className={styles.axis} aria-hidden>
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </figure>
  );
}
