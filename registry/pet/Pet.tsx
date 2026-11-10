"use client";

import { springs } from "@usefluid/motion";
import { MorphPath, useReducedMotion, useSpring } from "@usefluid/motion/react";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./Pet.module.css";

export type Mood = "idle" | "happy" | "surprised" | "sleepy" | "curious";

const TAU = Math.PI * 2;

function body(w: number, h: number, round: number, cy = 70, lean = 0) {
  let d = "";
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * TAU;
    const r = (Math.abs(Math.cos(a) / w) ** round + Math.abs(Math.sin(a) / h) ** round) ** (-1 / round);
    const y = cy + r * Math.sin(a);
    const x = 60 + r * Math.cos(a) + lean * ((cy - y) / h);
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

const BODIES: Record<Mood, string> = {
  idle: body(38, 36, 4.2),
  happy: body(42, 32, 4, 72),
  surprised: body(34, 41, 4.6, 66),
  sleepy: body(45, 28, 3.4, 78),
  curious: body(37, 37, 4.2, 70, 7),
};

type Eye = { oval: [number, number]; line: [number, number] };
type Face = { left: Eye; right: Eye; eyeY: number; drop: number; tilt: number };

const open = (w: number, h: number): Eye => ({ oval: [w, h], line: [0, 0] });
const line = (w: number, bend: number): Eye => ({ oval: [0, 0], line: [w, bend] });

const FACES: Record<Mood, Face> = {
  idle: { left: open(4.5, 6.5), right: open(4.5, 6.5), eyeY: 68, drop: 0, tilt: 0 },
  happy: { left: line(5.5, -5), right: line(5.5, -5), eyeY: 68, drop: -6, tilt: 0 },
  surprised: { left: open(6.5, 8.5), right: open(6.5, 8.5), eyeY: 62, drop: -14, tilt: 0 },
  sleepy: { left: line(6, 1.5), right: line(6, 1.5), eyeY: 78, drop: 10, tilt: 0 },
  curious: { left: open(3.8, 5.5), right: open(6, 8), eyeY: 67, drop: -4, tilt: 6 },
};

function eyeAttrs(eye: Eye, cx: number, cy: number) {
  const [lw, lb] = eye.line;
  return {
    oval: { cx, cy, rx: eye.oval[0], ry: eye.oval[1] },
    line: { d: `M${cx - lw} ${cy} Q${cx} ${cy + lb * 1.6} ${cx + lw} ${cy}`, strokeWidth: lw > 0.4 ? 3.2 : 0 },
  };
}

type Props = {
  mood?: Mood;
  still?: boolean;
  follow?: boolean;
  look?: { x: number; y: number };
  label?: string;
  className?: string;
};

export function Pet({ mood = "idle", still = false, follow = false, look, label, className }: Props) {
  const reduced = useReducedMotion();
  const mask = `pet-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const root = useRef<SVGSVGElement>(null);
  const parts = useRef<Record<string, SVGElement | null>>({});
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!follow) return;
    let back: ReturnType<typeof setTimeout> | undefined;
    const onMove = (e: PointerEvent) => {
      clearTimeout(back);
      if (e.pointerType !== "mouse") back = setTimeout(() => setGaze({ x: 0, y: 0 }), 1200);
      const box = root.current?.getBoundingClientRect();
      if (!box) return;
      const dx = (e.clientX - (box.left + box.width / 2)) / (box.width * 2);
      const dy = (e.clientY - (box.top + box.height / 2)) / (box.height * 2);
      const x = Math.round(Math.max(-1, Math.min(1, dx)) * 10) / 10;
      const y = Math.round(Math.max(-1, Math.min(1, dy)) * 10) / 10;
      setGaze((g) => (g.x === x && g.y === y ? g : { x, y }));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);
    return () => {
      clearTimeout(back);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [follow]);

  useEffect(() => {
    if (reduced || still || mood === "sleepy") return;
    let open: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setBlink(true);
      open = setTimeout(() => setBlink(false), 120);
    }, 3400);
    return () => {
      clearInterval(timer);
      clearTimeout(open);
    };
  }, [reduced, still, mood]);

  const f = FACES[mood];
  const g = follow ? gaze : (look ?? { x: 0, y: 0 });
  const first = useRef({ l: eyeAttrs(f.left, 60 + g.x * 6 - 13, f.eyeY + g.y * 4 - f.tilt * 0.4), r: eyeAttrs(f.right, 60 + g.x * 6 + 13, f.eyeY + g.y * 4 + f.tilt * 0.4) });

  useSpring(
    {
      lx: g.x * 6,
      ly: g.y * 4,
      ey: f.eyeY,
      low: f.left.oval[0],
      loh: blink ? 0.8 : f.left.oval[1],
      llw: f.left.line[0],
      llb: f.left.line[1],
      row: f.right.oval[0],
      roh: blink ? 0.8 : f.right.oval[1],
      rlw: f.right.line[0],
      rlb: f.right.line[1],
      drop: f.drop,
      tilt: f.tilt,
    },
    (v) => {
      const p = parts.current;
      const x = 60 + v.lx;
      const y = v.ey + v.ly;
      const set = (el: SVGElement | null, attrs: Record<string, number | string>) => {
        if (el) for (const k in attrs) el.setAttribute(k, String(attrs[k]));
      };
      const eye = (side: "l" | "r", cx: number, cy: number, ow: number, oh: number, lw: number, lb: number) => {
        set(p[`${side}Oval`], { cx, cy, rx: Math.max(0, ow), ry: Math.max(0, oh) });
        set(p[`${side}Line`], {
          d: `M${cx - lw} ${cy} Q${cx} ${cy + lb * 1.6} ${cx + lw} ${cy}`,
          "stroke-width": lw > 0.4 ? 3.2 : 0,
        });
      };
      eye("l", x - 13, y - v.tilt * 0.4, v.low, v.loh, v.llw, v.llb);
      eye("r", x + 13, y + v.tilt * 0.4, v.row, v.roh, v.rlw, v.rlb);
      if (p.drop) p.drop.setAttribute("transform", `translate(0 ${v.drop}) rotate(${v.tilt * 2} 88 22)`);
    },
    springs.snappy,
  );

  const ref = (name: string) => (el: SVGElement | null) => {
    parts.current[name] = el;
  };

  return (
    <svg
      ref={root}
      viewBox="0 0 120 120"
      className={[styles.pet, className].filter(Boolean).join(" ")}
      data-mood={mood}
      data-still={still || undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          <rect width="120" height="120" fill="#fff" />
          <ellipse ref={ref("lOval")} fill="#000" {...first.current.l.oval} />
          <ellipse ref={ref("rOval")} fill="#000" {...first.current.r.oval} />
          <path ref={ref("lLine")} fill="none" stroke="#000" strokeLinecap="round" {...first.current.l.line} />
          <path ref={ref("rLine")} fill="none" stroke="#000" strokeLinecap="round" {...first.current.r.line} />
        </mask>
      </defs>
      <g className={styles.body}>
        <MorphPath d={BODIES[mood]} fill="currentColor" mask={`url(#${mask})`} config={{ w: 12, z: 0.72, points: 120, spread: 0.1 }} />
      </g>
      <g ref={ref("drop")}>
        <circle cx="88" cy="22" r="6" fill="currentColor" className={styles.drop} />
      </g>
    </svg>
  );
}
