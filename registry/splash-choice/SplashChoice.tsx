"use client";

import { shapes, springCss, springs } from "@usefluid/motion";
import { MorphPath, useSequence, useSkip } from "@usefluid/motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SegmentedPicker } from "../segmented-picker/SegmentedPicker";
import styles from "./SplashChoice.module.css";

const DEFAULT_ROUTE = [shapes.dot, shapes.circle, shapes.triangle, shapes.flower, shapes.square, shapes.drop];
const BEAT = 0.36;
const rise = springCss(springs.soft);

export type Option = { value: string; label: string; word: string; shape: string };

type Props = {
  logo: string;
  title: string;
  word: string;
  options: Option[];
  value?: string | null;
  onChange?(value: string): void;
  label?: string;
  route?: string[];
  as?: "h1" | "h2";
  play?: boolean;
  finished?: boolean;
  skippable?: boolean;
  onDone?(): void;
};

export function SplashChoice({
  logo,
  title,
  word,
  options,
  value,
  onChange,
  label = "What you want to build",
  route = DEFAULT_ROUTE,
  as: Heading = "h2",
  play = true,
  finished = false,
  skippable = true,
  onDone,
}: Props) {
  const logoAt = route.length * BEAT;
  const times = [...route.map((_, i) => i * BEAT), logoAt, logoAt + 0.7];
  const stepLogo = route.length;
  const last = times.length - 1;
  const skipped = useSkip(play && skippable, finished);
  const live = useSequence(times, play && !skipped);
  const step = skipped ? last : live;
  const done = useRef(onDone);
  useLayoutEffect(() => {
    done.current = onDone;
  });
  const [own, setOwn] = useState<string | null>(null);
  const chosen = value !== undefined ? value : own;
  const option = options.find((o) => o.value === chosen);
  const column = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [placed, setPlaced] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (!column.current || !slot.current) return;
      setOffset(column.current.offsetHeight / 2 - (slot.current.offsetTop + slot.current.offsetHeight / 2));
    };
    measure();
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPlaced(true));
    });
    const observer = new ResizeObserver(measure);
    if (column.current) observer.observe(column.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (step === last) done.current?.();
  }, [step, last]);

  const risen = step >= last;
  const d = step < stepLogo ? route[step] : (option?.shape ?? logo);
  const shown = option?.word ?? word;

  return (
    <div className={styles.root} data-risen={risen}>
      <div ref={column} className={styles.column}>
        <div
          ref={slot}
          className={styles.slot}
          style={{
            transform: risen ? "none" : `translateY(${offset}px) scale(1.3)`,
            transition: placed ? `transform ${rise.duration}ms ${rise.easing}` : "none",
          }}
        >
          <svg viewBox="-8 -8 136 136" aria-hidden>
            <MorphPath d={d} fill="currentColor" config={{ w: 14, z: 0.74 }} />
          </svg>
        </div>
        <Heading className={styles.title}>
          <span className={styles.line}>{title}</span>
          <span className={styles.word}>
            <span key={shown} className={styles.wordIn}>{shown}</span>
          </span>
        </Heading>
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
