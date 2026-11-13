"use client";

import { useEffect, useState } from "react";
import styles from "./DocPage.module.css";

export type TocItem = { id: string; label: string; sub?: boolean };

export function Toc({ items, label }: { items: TocItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = items.find((i) => seen.get(i.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className={styles.toc}>
      <p className={styles.tocTitle}>{label}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id} data-sub={item.sub || undefined}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
