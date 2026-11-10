"use client";

import { useReducedMotion } from "@usefluid/motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./WordCycle.module.css";

type Props = {
  words: string[];
  every?: number;
  loop?: boolean;
  play?: boolean;
};

export function WordCycle({ words, every = 1.6, loop = true, play = true }: Props) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const previous = useRef<number | null>(null);

  useEffect(() => {
    if (!play || reduced) return;
    const timer = setInterval(() => {
      setIndex((i) => {
        previous.current = i;
        if (i + 1 < words.length) return i + 1;
        return loop ? 0 : i;
      });
    }, every * 1000);
    return () => clearInterval(timer);
  }, [play, reduced, every, loop, words.length]);

  const current = reduced ? words.length - 1 : index;
  const leaving = !reduced && previous.current !== null && previous.current !== current ? previous.current : null;

  return (
    <span className={styles.root}>
      <span className={styles.srOnly}>{words[words.length - 1]}</span>
      <span className={styles.stack} aria-hidden>
        {words.map((word) => (
          <span key={word} className={styles.sizer}>{word}</span>
        ))}
        <span key={`in-${current}`} className={leaving === null ? styles.still : styles.in}>{words[current]}</span>
        {leaving !== null && <span key={`out-${leaving}-${current}`} className={styles.out}>{words[leaving]}</span>}
      </span>
    </span>
  );
}
