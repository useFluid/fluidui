"use client";

import { scalePath } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";
import { useState } from "react";
import styles from "./IconRecipe.module.css";

const PLAY = scalePath("M6 3l14 9-14 9V3Z", 24);
const PAUSE = scalePath("M6 4h4v16H6zM14 4h4v16h-4z", 24);

export function IconRecipe() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={styles.stage} data-testid="icon-recipe">
      <button type="button" className={styles.button} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
        <svg viewBox="0 0 120 120" width={40} height={40} aria-hidden>
          <MorphPath d={playing ? PAUSE : PLAY} fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
