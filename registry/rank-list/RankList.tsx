"use client";

import { useSpring } from "@usefluid/motion/react";
import { useMemo, useRef, useState } from "react";
import { type Ranked, rank, roundLike } from "./rank";
import styles from "./RankList.module.css";

const ROW = 60;
const MOVE = { w: 13, z: 0.74 };
const ROLL = { w: 9, z: 1 };

type Props = {
  label: string;
  items: Ranked[];
  order?: "desc" | "asc";
  format?: Intl.NumberFormatOptions;
  locale?: string;
};

function Row({ item, place, number }: { item: Ranked; place: number; number: Intl.NumberFormat }) {
  const row = useRef<HTMLLIElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const [first] = useState(() => number.format(item.value));
  useSpring(
    { y: place },
    ({ y }, { y: v }) => {
      if (!row.current) return;
      row.current.style.transform = `translateY(${y * ROW}px) scale(${1 + Math.min(0.04, Math.abs(v) * 0.01)})`;
      row.current.style.zIndex = v < -0.05 ? "2" : "1";
    },
    MOVE,
  );
  useSpring(
    { v: item.value },
    ({ v }) => {
      if (out.current) out.current.textContent = number.format(roundLike(v, item.value));
    },
    ROLL,
  );
  return (
    <li ref={row} className={styles.row} data-top={place === 0 ? "" : undefined}>
      <span className={styles.place} aria-hidden>
        {place + 1}
      </span>
      <span className={styles.name}>{item.label}</span>
      <span ref={out} className={styles.value} aria-hidden>
        {first}
      </span>
      <span className={styles.hidden}>{number.format(item.value)}</span>
    </li>
  );
}

export function RankList({ label, items, order = "desc", format, locale }: Props) {
  const key = JSON.stringify(format ?? {});
  const number = useMemo(() => new Intl.NumberFormat(locale, JSON.parse(key)), [locale, key]);
  const ranked = rank(items, order);
  return (
    <figure className={styles.root}>
      <figcaption className={styles.label}>{label}</figcaption>
      <ol className={styles.list} style={{ height: ranked.length * ROW }}>
        {ranked.map((item, place) => (
          <Row key={item.id} item={item} place={place} number={number} />
        ))}
      </ol>
    </figure>
  );
}
