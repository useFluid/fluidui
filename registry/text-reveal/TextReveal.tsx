"use client";

import { springCss, springs } from "@usefluid/motion";
import styles from "./TextReveal.module.css";

const spring = springCss(springs.bouncy);

export function TextReveal({ text, play = true, stagger = 28 }: { text: string; play?: boolean; stagger?: number }) {
  let index = 0;
  return (
    <span
      className={styles.root}
      data-play={play}
      style={{ "--easing": spring.easing, "--duration": `${spring.duration}ms` } as React.CSSProperties}
    >
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden>
        {text.split(" ").map((word, w) => (
          <span key={w} className={styles.word}>
            {word.split("").map((char, c) => (
              <span key={c} className={styles.char} style={{ transitionDelay: `${index++ * stagger}ms` }}>
                {char}
              </span>
            ))}
            {" "}
          </span>
        ))}
      </span>
    </span>
  );
}
