"use client";

import { springCss, springs } from "@usefluid/motion";
import { SegmentedPicker } from "@usefluid/registry/segmented-picker/SegmentedPicker.tsx";
import { useEffect, useId, useMemo, useRef, useState } from "react";
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

  const named = useMemo(() => ({ ...brand, name }), [brand, name]);
  const options = [
    { value: "medium" as const, label: c.medium },
    { value: "long" as const, label: c.long },
    { value: "huge" as const, label: c.huge },
    { value: "yours" as const, label: c.yours },
  ];

  return (
    <section className={styles.compare} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={styles.title}>{c.title}</h2>
      <p className={styles.text}>{c.text}</p>
      <div className={styles.controls}>
        <SegmentedPicker label={c.label} value={preset} onChange={choose} options={options} />
        <div className={styles.yours} data-open={preset === "yours" || undefined} inert={preset !== "yours"} style={spring.transition("grid-template-rows, opacity, transform")}>
          <div className={styles.clip}>
          <label className="srOnly" htmlFor={`${id}-name`}>{c.type}</label>
          <input
            ref={field}
            id={`${id}-name`}
            className={styles.input}
            value={draft}
            maxLength={40}
            placeholder={c.type}
            onChange={(e) => setDraft(e.target.value)}
          />
          </div>
        </div>
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
