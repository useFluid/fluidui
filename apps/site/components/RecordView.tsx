"use client";

import { DemoProvider } from "@usefluid/registry/demo-context.tsx";
import { demos } from "@usefluid/registry/demos.tsx";
import { brands } from "@usefluid/registry/brands.ts";
import { type CSSProperties, useEffect, useState } from "react";
import { type Paint, paintVars } from "./Mosaic";
import styles from "./RecordView.module.css";

const PAINTS: Paint[] = ["accent", "hot", "lime", "ink", "paper", "sky"];

type Options = { brand: string; paint: Paint | "white" };

function readOptions(): Options {
  const q = new URLSearchParams(window.location.search);
  const paint = q.get("background") ?? "accent";
  return {
    brand: q.get("brand") ?? brands[0].id,
    paint: (PAINTS as string[]).includes(paint) ? (paint as Paint) : "white",
  };
}

export function RecordView({ slug, loop }: { slug: string; loop?: number }) {
  const [options, setOptions] = useState<Options | null>(null);
  useEffect(() => setOptions(readOptions()), []);
  if (!options) return null;

  const brand = brands.find((b) => b.id === options.brand) ?? brands[0];
  const vars = { ...brand.vars, ...paintVars(options.paint, brand) };
  const Demo = demos[slug];
  return (
    <main className={styles.view} style={vars as CSSProperties} data-recording>
      <div className={styles.piece}>
        <DemoProvider value={{ name: brand.name, logo: brand.logo, play: true, auto: true }}>
          <Demo />
        </DemoProvider>
      </div>
      <span hidden data-loop={loop ?? ""} />
    </main>
  );
}
