"use client";

import { type ReactNode, useId, useState } from "react";
import styles from "./CodeToggle.module.css";

export function CodeToggle({ show, hide, children }: { show: string; hide: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.button} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4" />
        </svg>
        {open ? hide : show}
      </button>
      <div id={id} hidden={!open}>{children}</div>
    </div>
  );
}
