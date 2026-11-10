"use client";

import { brands } from "@usefluid/registry/brands.ts";
import { Stage } from "./Stage";
import styles from "./BrandsRow.module.css";

export function BrandsRow({ loop }: { loop?: number }) {
  return (
    <ul className={styles.row}>
      {brands.map((brand) => (
        <li key={brand.id} className={styles.item}>
          <Stage slug="splash-choice" loop={loop} brand={brand} preview className={styles.stage} />
          <p className={styles.name}>{brand.name}</p>
        </li>
      ))}
    </ul>
  );
}
