"use client";

import { MorphPath } from "@usefluid/motion/react";
import { useEffect, useId, useRef } from "react";
import styles from "./MenuMorph.module.css";

const W = 320;
const BUTTON = 48;
const PAD = 16;
const TOP = 64;
const ROW_H = 44;
const GAP = 8;

const rect = (x: number, y: number, w: number, h: number, r: number) => {
  const k = Math.min(r, w / 2, h / 2);
  return `M${x + k} ${y}H${x + w - k}A${k} ${k} 0 0 1 ${x + w} ${y + k}V${y + h - k}A${k} ${k} 0 0 1 ${x + w - k} ${y + h}H${x + k}A${k} ${k} 0 0 1 ${x} ${y + h - k}V${y + k}A${k} ${k} 0 0 1 ${x + k} ${y}Z`;
};

const BODY_SPRING = { w: 13, z: 0.8, points: 140, spread: 0.18 };
const BAR_SPRING = { w: 15, z: 0.78, points: 80, spread: 0.12 };

export type MenuItem = { label: string; href?: string; current?: boolean; onSelect?(): void };

type Props = {
  open: boolean;
  onOpenChange(open: boolean): void;
  items: MenuItem[];
  title?: string;
  label?: string;
  side?: "left" | "right";
};

export function MenuMorph({ open, onOpenChange, items, title, label = "Menu", side = "right" }: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const height = TOP + items.length * (ROW_H + GAP) + PAD - GAP;
  const x = (left: number, width: number) => (side === "left" ? left : W - left - width);

  const bodyClosed = rect(x(0, BUTTON), 0, BUTTON, BUTTON, BUTTON / 2);
  const bodyOpen = rect(0, 0, W, height, 26);
  const barsClosed = [15, 22, 29].map((y) => rect(x(13, 22), y, 22, 4, 2)).join("");
  const barsOpen = items.map((_, i) => rect(PAD, TOP + i * (ROW_H + GAP), W - PAD * 2, ROW_H, 22)).join("");

  useEffect(() => {
    if (open) return;
    if (root.current?.contains(document.activeElement) && document.activeElement !== toggle.current) toggle.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) onOpenChange(false);
    };
    addEventListener("pointerdown", outside);
    return () => removeEventListener("pointerdown", outside);
  }, [open, onOpenChange]);

  return (
    <div
      ref={root}
      className={styles.root}
      data-open={open}
      data-side={side}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) onOpenChange(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          onOpenChange(false);
          toggle.current?.focus();
        }
      }}
    >
      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? `Close ${label.toLowerCase()}` : label}
        onClick={() => onOpenChange(!open)}
      />
      <div className={styles.card} style={{ aspectRatio: `${W} / ${height}` }}>
        <svg viewBox={`0 0 ${W} ${height}`} className={styles.svg} aria-hidden>
          <MorphPath d={open ? bodyOpen : bodyClosed} config={BODY_SPRING} className={styles.body} />
          <MorphPath d={open ? barsOpen : barsClosed} config={BAR_SPRING} className={styles.bars} />
        </svg>
        {title && <p className={styles.title} aria-hidden>{title}</p>}
        <ul id={id} className={styles.items} inert={!open}>
          {items.map((item, i) => (
            <li
              key={item.label}
              style={{
                top: `${((TOP + i * (ROW_H + GAP)) / height) * 100}%`,
                height: `${(ROW_H / height) * 100}%`,
                transitionDelay: open ? `${180 + i * 50}ms` : "0ms",
              }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  onClick={(e) => {
                    if (item.onSelect && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
                      e.preventDefault();
                      item.onSelect();
                    }
                    onOpenChange(false);
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <button type="button" aria-current={item.current ? "page" : undefined} onClick={() => { item.onSelect?.(); onOpenChange(false); }}>{item.label}</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
