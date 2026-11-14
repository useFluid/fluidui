"use client";

import { useId, useMemo, useState } from "react";
import { useBrand } from "./BrandProvider";
import { useLang } from "./LangProvider";
import { Stage } from "./Stage";
import styles from "./NameCompare.module.css";

const LONG = "Northwind Coffee Roasters";

export function NameCompare() {
  const { brand } = useBrand();
  const { t } = useLang();
  const c = t.splash.compare;
  const id = useId();
  const [long, setLong] = useState(LONG);
  const short = useMemo(() => brand, [brand]);
  const named = useMemo(() => ({ ...brand, name: long.trim() || LONG }), [brand, long]);

  return (
    <section className={styles.compare} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={styles.title}>{c.title}</h2>
      <p className={styles.text}>{c.text}</p>
      <label className={styles.field} htmlFor={`${id}-name`}>
        {c.label}
      </label>
      <input id={`${id}-name`} className={styles.input} value={long} maxLength={40} onChange={(e) => setLong(e.target.value)} />
      <div className={styles.pair}>
        <figure className={styles.item}>
          <Stage slug="splash-dots" loop={5.2} brand={short} className={styles.stage} />
          <figcaption>{c.short} · {short.name.length} {c.chars}</figcaption>
        </figure>
        <figure className={styles.item}>
          <Stage slug="splash-dots" loop={5.2} brand={named} className={styles.stage} />
          <figcaption>{c.long} · {named.name.length} {c.chars}</figcaption>
        </figure>
      </div>
    </section>
  );
}
