"use client";

import { useSpring } from "@usefluid/motion/react";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { monthGrid, moveDate, sameDay } from "./calendar";
import styles from "./SpringCalendar.module.css";

type Props = {
  value: Date | null;
  onChange(date: Date): void;
  locale?: string;
  weekStart?: 0 | 1;
  previousLabel?: string;
  nextLabel?: string;
};

const iso = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export function SpringCalendar({ value, onChange, locale, weekStart = 1, previousLabel = "Previous month", nextLabel = "Next month" }: Props) {
  const start = value ?? new Date();
  const [view, setView] = useState({ year: start.getFullYear(), month: start.getMonth() });
  const [focus, setFocus] = useState(start);
  const grid = useRef<HTMLDivElement>(null);
  const days = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const typed = useRef(false);
  const placed = useRef(false);
  const today = useMemo(() => new Date(), []);

  const cells = monthGrid(view.year, view.month, weekStart);
  const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(view.year, view.month, 1));
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const long = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
  const index = view.year * 12 + view.month;
  const picked = cells.findIndex((c) => sameDay(c.date, value));
  const shown = picked >= 0;

  const valueKey = value ? iso(value) : "";
  useEffect(() => {
    if (!value) return;
    setView((v) => (v.year === value.getFullYear() && v.month === value.getMonth() ? v : { year: value.getFullYear(), month: value.getMonth() }));
    setFocus(value);
  }, [valueKey]);

  useSpring(
    { s: index },
    ({ s }) => {
      if (!days.current) return;
      const offset = Math.max(-1, Math.min(1, index - s));
      days.current.style.transform = `translateX(${offset * 36}px)`;
      days.current.style.opacity = `${1 - Math.abs(offset) * 0.7}`;
    },
    { w: 14, z: 0.8 },
  );

  useSpring(
    { x: shown ? picked % 7 : 0, y: shown ? Math.floor(picked / 7) : 0 },
    ({ x, y }) => {
      if (pill.current) pill.current.style.transform = `translate(${x * 100}%, ${y * 100}%)`;
    },
    { w: 17, z: 0.7, immediate: !placed.current },
  );
  useEffect(() => {
    if (shown) placed.current = true;
  }, [shown]);

  useEffect(() => {
    if (!typed.current) return;
    typed.current = false;
    grid.current?.querySelector<HTMLElement>(`[data-date="${iso(focus)}"]`)?.focus();
  }, [focus]);

  const show = (date: Date) => {
    if (date.getMonth() !== view.month || date.getFullYear() !== view.year) setView({ year: date.getFullYear(), month: date.getMonth() });
  };
  const turn = (months: number) => {
    const next = new Date(view.year, view.month + months, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  };
  const choose = (date: Date) => {
    onChange(date);
    setFocus(date);
    show(date);
  };
  const key = (e: KeyboardEvent) => {
    const next = moveDate(focus, e.key, weekStart);
    if (!next) return;
    e.preventDefault();
    typed.current = true;
    setFocus(next);
    show(next);
  };
  const focusable = cells.some((c) => sameDay(c.date, focus)) ? focus : cells.find((c) => c.inMonth)?.date;

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <span className={styles.title} aria-live="polite">
          {title}
        </span>
        <button type="button" className={styles.nav} aria-label={previousLabel} onClick={() => turn(-1)}>
          <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={styles.nav} aria-label={nextLabel} onClick={() => turn(1)}>
          <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div ref={grid} role="grid" aria-label={title} className={styles.grid}>
        <div role="row" tabIndex={-1} className={styles.week}>
          {cells.slice(0, 7).map((c) => (
            <span key={c.date.getDay()} role="columnheader" tabIndex={-1} className={styles.weekday}>
              {weekday.format(c.date)}
            </span>
          ))}
        </div>
        <div ref={days} className={styles.days}>
          <span ref={pill} className={styles.pill} data-on={shown ? "" : undefined} aria-hidden />
          {Array.from({ length: 6 }, (_, row) => (
            <div role="row" tabIndex={-1} key={row} className={styles.row}>
              {cells.slice(row * 7, row * 7 + 7).map((c) => (
                <button
                  key={iso(c.date)}
                  type="button"
                  role="gridcell"
                  data-date={iso(c.date)}
                  data-out={c.inMonth ? undefined : ""}
                  data-today={sameDay(c.date, today) ? "" : undefined}
                  aria-selected={sameDay(c.date, value)}
                  aria-label={long.format(c.date)}
                  tabIndex={sameDay(c.date, focusable) ? 0 : -1}
                  className={styles.day}
                  onClick={() => choose(c.date)}
                  onKeyDown={key}
                >
                  {c.date.getDate()}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
