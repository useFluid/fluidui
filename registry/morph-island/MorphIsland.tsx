"use client";

import { useSpring } from "@usefluid/motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./MorphIsland.module.css";

const BODY = { w: 17, z: 0.8 };

type Props = {
  label: string;
  closeLabel?: string;
  children: ReactNode;
  width?: number;
  height?: number;
  closedWidth?: number;
  open?: boolean;
  onOpenChange?(open: boolean): void;
};

export function MorphIsland({
  label, closeLabel = "Close", children, width = 300, height = 170, closedWidth = 150, open: controlled, onOpenChange,
}: Props) {
  const [own, setOwn] = useState(false);
  const open = controlled ?? own;
  const body = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const byPerson = useRef(false);

  const set = (next: boolean) => {
    byPerson.current = true;
    setOwn(next);
    onOpenChange?.(next);
  };

  useSpring(
    { w: open ? width : closedWidth, h: open ? height : 44 },
    ({ w, h }) => {
      if (!body.current) return;
      body.current.style.width = `${w}px`;
      body.current.style.height = `${h}px`;
    },
    BODY,
  );

  useEffect(() => {
    if (!byPerson.current) return;
    byPerson.current = false;
    if (open) close.current?.focus();
    else trigger.current?.focus();
  }, [open]);

  return (
    <div ref={body} className={styles.body} data-open={open} onKeyDown={(e) => { if (e.key === "Escape") set(false); }}>
      <button ref={trigger} type="button" aria-expanded={open} className={styles.trigger} inert={open} onClick={() => set(true)}>
        {label}
      </button>
      <div className={styles.panel} inert={!open} style={{ width: `min(${width}px, 100cqi)` }}>
        <div className={styles.content}>{children}</div>
        <button ref={close} type="button" className={styles.close} onClick={() => set(false)}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
