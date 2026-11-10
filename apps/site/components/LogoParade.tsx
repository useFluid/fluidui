"use client";

import { shapes } from "@usefluid/motion";
import { MorphPath, useReducedMotion } from "@usefluid/motion/react";
import { useEffect, useState } from "react";
import { useBrand } from "./BrandProvider";
import styles from "./LogoParade.module.css";

const ROUTE = [shapes.circle, shapes.triangle, shapes.square, shapes.flower];

export function LogoParade() {
  const { brand } = useBrand();
  const reduced = useReducedMotion();
  const [i, setI] = useState(ROUTE.length);
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setI((n) => (n + 1) % (ROUTE.length + 3)), 700);
    return () => clearInterval(timer);
  }, [reduced]);
  const d = i < ROUTE.length ? ROUTE[i] : brand.logo;
  return (
    <figure className={styles.parade}>
      <svg viewBox="-10 -10 140 140" className={styles.svg} role="img" aria-label={`${brand.name} logo`}>
        <MorphPath d={d} fill="currentColor" config={{ w: 15, z: 0.62 }} />
      </svg>
    </figure>
  );
}
