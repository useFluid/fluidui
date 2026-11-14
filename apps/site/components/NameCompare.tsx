"use client";

import { springCss, springs } from "@usefluid/motion";
import { SegmentedPicker } from "@usefluid/registry/segmented-picker/SegmentedPicker.tsx";
import { type ReactNode, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useBrand } from "./BrandProvider";
import { useLang } from "./LangProvider";
import { Stage } from "./Stage";
import styles from "./NameCompare.module.css";

const PRESETS = {
  medium: "Café Aurora",
  long: "Northwind Coffee Roasters",
  huge: "Padaria e Confeitaria Dona Maria",
} as const;

type Preset = keyof typeof PRESETS | "yours";

const spring = springCss(springs.bouncy);

export function NameCompare() {
  const { brand } = useBrand();
  const { t } = useLang();
  const c = t.splash.compare;
  const id = useId();
  const [preset, setPreset] = useState<Preset>("long");
  const [draft, setDraft] = useState("");
  const [name, setName] = useState<string>(PRESETS.long);
  const [take, setTake] = useState(0);
  const field = useRef<HTMLInputElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const [slot, setSlot] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const radios = controls.current?.querySelectorAll<HTMLElement>('[role="radio"]');
    const last = radios?.[radios.length - 1];
    if (!last) return;
    const place = () => setSlot({ left: last.offsetLeft - (last.parentElement?.scrollLeft ?? 0), width: last.offsetWidth });
    place();
    const observer = new ResizeObserver(place);
    observer.observe(last);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (preset !== "yours") return;
    const typed = draft.trim();
    if (!typed || typed === name) return;
    const timer = setTimeout(() => {
      setName(typed);
      setTake((n) => n + 1);
    }, 550);
    return () => clearTimeout(timer);
  }, [draft, preset, name]);

  const choose = (next: Preset) => {
    setPreset(next);
    if (next === "yours") {
      requestAnimationFrame(() => field.current?.focus());
      if (draft.trim()) {
        setName(draft.trim());
        setTake((n) => n + 1);
      }
      return;
    }
    setName(PRESETS[next]);
    setTake((n) => n + 1);
  };

  const open = preset === "yours";
  const named = useMemo(() => ({ ...brand, name }), [brand, name]);
  const both = (full: string, short: string): ReactNode => (
    <>
      <span className={styles.full}>{full}</span>
      <span className={styles.short} aria-hidden>{short}</span>
    </>
  );
  const options = [
    { value: "medium" as const, label: both(c.medium, "M"), ariaLabel: c.medium },
    { value: "long" as const, label: both(c.long, "L"), ariaLabel: c.long },
    { value: "huge" as const, label: both(c.huge, "XL"), ariaLabel: c.huge },
    {
      value: "yours" as const,
      ariaLabel: c.yours,
      label: (
        <span className={styles.slot} data-open={open || undefined} style={spring.transition("width")}>
          <span className={styles.slotLabel} aria-hidden>{c.yours}</span>
        </span>
      ),
    },
  ];

  return (
    <section className={styles.compare} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={styles.title}>{c.title}</h2>
      <p className={styles.text}>{c.text}</p>
      <div ref={controls} className={styles.controls} data-open={open || undefined}>
        <SegmentedPicker label={c.label} value={preset} onChange={choose} options={options} />
        <label className="srOnly" htmlFor={`${id}-name`}>{c.type}</label>
        <input
          ref={field}
          id={`${id}-name`}
          className={styles.input}
          style={{ left: slot.left, width: slot.width }}
          data-open={open || undefined}
          inert={!open}
          value={draft}
          maxLength={40}
          placeholder={c.placeholder}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setDraft(e.target.value)}
        />
      </div>
      <div className={styles.pair}>
        <figure className={styles.item}>
          <Stage key={`short-${take}`} slug="splash-dots" brand={brand} className={styles.stage} />
          <figcaption>{c.short} · {brand.name.length} {c.chars}</figcaption>
        </figure>
        <figure className={styles.item}>
          <Stage key={`long-${take}`} slug="splash-dots" brand={named} className={styles.stage} />
          <figcaption aria-live="polite">{name} · {name.length} {c.chars}</figcaption>
        </figure>
      </div>
    </section>
  );
}
