"use client";

import { MorphPath } from "@usefluid/motion/react";
import { useEffect, useId, useRef } from "react";
import styles from "./MenuMorph.module.css";

const W = 320;
const H = 240;
const ROWS = [64, 120, 176];
const ROW_H = 44;

const rect = (x: number, y: number, w: number, h: number, r: number) => {
  const k = Math.min(r, w / 2, h / 2);
  return `M${x + k} ${y}H${x + w - k}A${k} ${k} 0 0 1 ${x + w} ${y + k}V${y + h - k}A${k} ${k} 0 0 1 ${x + w - k} ${y + h}H${x + k}A${k} ${k} 0 0 1 ${x} ${y + h - k}V${y + k}A${k} ${k} 0 0 1 ${x + k} ${y}Z`;
};

const BODY_CLOSED = rect(4, 4, 48, 48, 24);
const BODY_OPEN = rect(0, 0, W, H, 26);
const BARS_CLOSED = [19, 27, 35].map((y) => rect(16, y, 24, 4, 2)).join("");
const BARS_OPEN = ROWS.map((y) => rect(16, y, W - 32, ROW_H, 22)).join("");

const BODY_SPRING = { w: 13, z: 0.8, points: 140, spread: 0.18 };
const BAR_SPRING = { w: 15, z: 0.78, points: 80, spread: 0.12 };

type Item = { label: string; onSelect?(): void };

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
  items: Item[];
  title?: string;
};

export function MenuMorph({ open, onOpenChange, items, title = "Menu" }: Props) {
  const id = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const byPerson = useRef(false);

  useEffect(() => {
    if (!byPerson.current) return;
    byPerson.current = false;
    if (!open) toggle.current?.focus();
  }, [open]);

  const set = (next: boolean) => {
    byPerson.current = true;
    onOpenChange(next);
  };

  return (
    <div className={styles.root} data-open={open} onKeyDown={(e) => { if (e.key === "Escape") set(false); }}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden>
        <MorphPath d={open ? BODY_OPEN : BODY_CLOSED} config={BODY_SPRING} className={styles.body} />
        <MorphPath d={open ? BARS_OPEN : BARS_CLOSED} config={BAR_SPRING} className={styles.bars} />
      </svg>
      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? `Close ${title.toLowerCase()}` : title}
        onClick={() => set(!open)}
      />
      <p className={styles.title} aria-hidden>{title}</p>
      <ul id={id} className={styles.items} inert={!open}>
        {items.slice(0, ROWS.length).map((item, i) => (
          <li
            key={item.label}
            style={{
              top: `${(ROWS[i] / H) * 100}%`,
              height: `${(ROW_H / H) * 100}%`,
              transitionDelay: open ? `${180 + i * 60}ms` : "0ms",
            }}
          >
            <button type="button" onClick={item.onSelect}>{item.label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
