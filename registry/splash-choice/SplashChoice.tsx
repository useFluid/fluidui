"use client";

import { shapes, springCss, springs } from "@usefluid/motion";
import { MorphPath, useSequence } from "@usefluid/motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { SegmentedPicker } from "../segmented-picker/SegmentedPicker";
import styles from "./SplashChoice.module.css";

const ROUTE = [shapes.dot, shapes.circle, shapes.triangle, shapes.flower, shapes.square, shapes.drop];
const BEAT = 0.36;
const LOGO_AT = ROUTE.length * BEAT;
const RISE_AT = LOGO_AT + 0.7;
const TIMES = [...ROUTE.map((_, i) => i * BEAT), LOGO_AT, RISE_AT];
const STEP_LOGO = ROUTE.length;
const STEP_RISE = STEP_LOGO + 1;

const rise = springCss(springs.soft);

export type Option = { value: string; label: string; word: string; shape: string };

type Props = {
  logo: string;
  title: string;
  word: string;
  options: Option[];
  value?: string | null;
  onChange?(value: string): void;
  play?: boolean;
  label?: string;
};

export function SplashChoice({ logo, title, word, options, value, onChange, play = true, label = "What you want to build" }: Props) {
  const step = useSequence(TIMES, play);
  const [own, setOwn] = useState<string | null>(null);
  const chosen = value !== undefined ? value : own;
  const option = options.find((o) => o.value === chosen);
  const column = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!column.current || !slot.current) return;
      setOffset(column.current.offsetHeight / 2 - (slot.current.offsetTop + slot.current.offsetHeight / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (column.current) observer.observe(column.current);
    return () => observer.disconnect();
  }, []);

  const risen = step >= STEP_RISE;
  const d = step < STEP_LOGO ? ROUTE[step] : (option?.shape ?? logo);
  const shown = option?.word ?? word;

  return (
    <div className={styles.root} data-risen={risen}>
      <div ref={column} className={styles.column}>
        <div
          ref={slot}
          className={styles.slot}
          style={{
            transform: risen ? "none" : `translateY(${offset}px) scale(1.3)`,
            transition: `transform ${rise.duration}ms ${rise.easing}`,
          }}
        >
          <svg viewBox="-8 -8 136 136" aria-hidden>
            <MorphPath d={d} fill="currentColor" config={{ w: 14, z: 0.74 }} />
          </svg>
        </div>
        <h2 className={styles.title}>
          <span className={styles.line}>{title}</span>
          <span className={styles.word}>
            <span key={shown} className={styles.wordIn}>{shown}</span>
          </span>
        </h2>
        <div className={styles.picker} inert={!risen}>
          <SegmentedPicker
            label={label}
            value={chosen ?? ""}
            onChange={(v) => {
              setOwn(v);
              onChange?.(v);
            }}
            options={options.map((o) => ({ value: o.value, label: o.label }))}
          />
        </div>
      </div>
    </div>
  );
}
