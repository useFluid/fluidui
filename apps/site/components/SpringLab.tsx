"use client";

import { createSpring } from "@usefluid/motion";
import { useSpring } from "@usefluid/motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLang } from "./LangProvider";
import styles from "./SpringLab.module.css";

const DURATION = 1.4;
const SAMPLES = 120;

function curve(w: number, z: number) {
  const s = createSpring(0, { w, z });
  s.target = 1;
  const points: [number, number][] = [[0, 0]];
  for (let i = 1; i <= SAMPLES; i++) {
    s.step(DURATION / SAMPLES);
    points.push([i / SAMPLES, s.value]);
  }
  return points;
}

export function SpringLab() {
  const { t } = useLang();
  const id = useId();
  const [w, setW] = useState(20);
  const [z, setZ] = useState(0.5);
  const [side, setSide] = useState(0);
  const ball = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const d = useMemo(() => {
    const points = curve(w, z);
    return points.map(([t, v], i) => `${i ? "L" : "M"}${(t * 300).toFixed(1)} ${(150 - v * 100).toFixed(1)}`).join("");
  }, [w, z]);

  useEffect(() => {
    const timer = setInterval(() => setSide((s) => 1 - s), 1400);
    return () => clearInterval(timer);
  }, []);

  useSpring(
    { x: side },
    ({ x }, velocity) => {
      if (!ball.current || !track.current) return;
      const travel = track.current.offsetWidth - ball.current.offsetWidth;
      const stretch = Math.min(0.5, Math.abs(velocity.x) * 0.06);
      ball.current.style.transform = `translateX(${travel * (0.12 + x * 0.76)}px) scale(${1 + stretch}, ${1 - stretch * 0.5})`;
    },
    { w, z },
  );

  return (
    <div className={styles.lab}>
      <div className={styles.controls}>
        <label htmlFor={`${id}-w`} className={styles.label}>
          {t.lab.frequency} <output>{w}</output>
        </label>
        <input id={`${id}-w`} type="range" min={6} max={40} step={1} value={w} onChange={(e) => setW(Number(e.target.value))} />
        <label htmlFor={`${id}-z`} className={styles.label}>
          {t.lab.damping} <output>{z.toFixed(2)}</output>
        </label>
        <input id={`${id}-z`} type="range" min={0.2} max={1.4} step={0.02} value={z} onChange={(e) => setZ(Number(e.target.value))} />
        <pre className={`${styles.code} scroll-dark`}>
          <code>{`useSpring(alvo, aplicar, { w: ${w}, z: ${z.toFixed(2)} })`}</code>
        </pre>
      </div>
      <div className={styles.view}>
        <svg viewBox="-10 -10 320 180" className={styles.graph} role="img" aria-label={t.lab.graph}>
          <line x1="0" y1="50" x2="300" y2="50" className={styles.target} />
          <line x1="0" y1="150" x2="300" y2="150" className={styles.axis} />
          <path d={d} className={styles.curve} />
        </svg>
        <div ref={track} className={styles.track} aria-hidden>
          <span ref={ball} className={styles.ball} />
        </div>
      </div>
    </div>
  );
}
