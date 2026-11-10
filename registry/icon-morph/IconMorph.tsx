"use client";

import { MorphPath } from "@usefluid/motion/react";
import type { ButtonHTMLAttributes } from "react";
import styles from "./IconMorph.module.css";

export const icons = {
  menu: "M20 28h80v14H20zM20 53h80v14H20zM20 78h80v14H20z",
  close: "M31 21L60 50L89 21L99 31L70 60L99 89L89 99L60 70L31 99L21 89L50 60L21 31Z",
  play: "M36 20L100 60L36 100Z",
  pause: "M28 22h24v76H28zM68 22h24v76H68z",
  plus: "M52 20h16v32h32v16H68v32H52V68H20V52h32z",
  check: "M18 62L32 48L50 66L88 28L102 42L50 94Z",
};

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  on: boolean;
  off: string;
  onIcon: string;
  label: string;
};

export function IconMorph({ on, off, onIcon, label, className, ...props }: Props) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      className={[styles.button, className].filter(Boolean).join(" ")}
      {...props}
    >
      <svg viewBox="0 0 120 120" aria-hidden className={styles.icon}>
        <MorphPath d={on ? onIcon : off} fill="currentColor" config={{ w: 20, z: 0.76, points: 96 }} />
      </svg>
    </button>
  );
}
