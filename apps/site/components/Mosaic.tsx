"use client";

import type { Brand } from "@usefluid/registry/brands.ts";
import { SegmentedPicker } from "@usefluid/registry/segmented-picker/SegmentedPicker.tsx";
import { type CSSProperties, useState } from "react";
import { useBrand } from "./BrandProvider";
import { both } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { PieceLink } from "./PieceDialog";
import { SameWidth } from "./SameWidth";
import { Stage } from "./Stage";
import styles from "./Mosaic.module.css";

export type Paint = "accent" | "hot" | "lime" | "ink" | "paper" | "sky";

export function paintVars(paint: Paint | "white", brand: Brand): Record<string, string> {
  const accent = brand.vars["--fluid-accent"];
  const onAccent = brand.vars["--fluid-on-accent"];
  const onDark = brand.id === "fluid" ? "#6fc4fd" : `color-mix(in srgb, ${accent} 62%, white)`;
  const set = (bg: string, text: string, a: string, onA: string, surface: string) => ({
    "--stage-bg": bg,
    "--fluid-text": text,
    "--fluid-text-2": `color-mix(in srgb, ${text} 78%, transparent)`,
    "--fluid-accent": a,
    "--fluid-on-accent": onA,
    "--fluid-surface": surface,
    "--fluid-border": `color-mix(in srgb, ${text} 22%, transparent)`,
    "--fluid-focus": text,
  });
  switch (paint) {
    case "accent":
      return set(accent, onAccent, onAccent, accent, "transparent");
    case "hot":
      return set("#ff5a1f", "#140200", "#140200", "#ffffff", "transparent");
    case "lime":
      return set("#d6f21a", "#0b0b0c", "#0b0b0c", "#d6f21a", "#ecff66");
    case "ink":
      return set("#11100f", "#ffffff", onDark, "#11100f", "transparent");
    case "paper":
      return set("#efe9df", "#0b0b0c", accent, onAccent, "#ffffff");
    case "sky":
      return set("#6fc4fd", "#11100f", accent, onAccent, "#ffffff");
    case "white":
      return {
        ...set("var(--surface)", "var(--text)", `light-dark(${accent}, ${onDark})`, `light-dark(${onAccent}, #11100f)`, "transparent"),
        "--fluid-text-2": "var(--text-2)",
      };
  }
}

const LAYOUT: { slug: string; paint: Paint; columns: number; rows: number }[] = [
  { slug: "splash-choice", paint: "accent", columns: 5, rows: 3 },
  { slug: "icon-morph", paint: "hot", columns: 3, rows: 2 },
  { slug: "splash-dots", paint: "paper", columns: 4, rows: 3 },
  { slug: "spring-switch", paint: "sky", columns: 3, rows: 1 },
  { slug: "word-cycle", paint: "ink", columns: 5, rows: 2 },
  { slug: "morph-loader", paint: "lime", columns: 3, rows: 2 },
  { slug: "segmented-picker", paint: "hot", columns: 4, rows: 2 },
  { slug: "morph-button", paint: "paper", columns: 4, rows: 1 },
  { slug: "spring-button", paint: "lime", columns: 3, rows: 1 },
  { slug: "logo-wipe", paint: "sky", columns: 5, rows: 3 },
  { slug: "morph-island", paint: "hot", columns: 4, rows: 2 },
  { slug: "text-reveal", paint: "ink", columns: 3, rows: 2 },
  { slug: "pet", paint: "lime", columns: 5, rows: 3 },
  { slug: "bot", paint: "sky", columns: 7, rows: 3 },
  { slug: "menu-morph", paint: "paper", columns: 7, rows: 3 },
  { slug: "island-toast", paint: "ink", columns: 5, rows: 2 },
  { slug: "copy-morph", paint: "hot", columns: 5, rows: 1 },
  { slug: "pill-tabs", paint: "sky", columns: 12, rows: 1 },
  { slug: "splash-shapes", paint: "accent", columns: 7, rows: 3 },
  { slug: "shape-morph", paint: "ink", columns: 5, rows: 3 },
];

type Tile = { slug: string; name: string; loop?: number };

export function Mosaic({ entries }: { entries: Tile[] }) {
  const { brand } = useBrand();
  const { lang, t } = useLang();
  const viewLabel = t.mosaic.view;
  const [mode, setMode] = useState<"color" | "white">("color");
  return (
    <div>
      <div className={styles.toolbar}>
        <SegmentedPicker
          label={t.mosaic.background}
          value={mode}
          onChange={(v) => setMode(v === "white" ? "white" : "color")}
          options={[
            { value: "color", label: <SameWidth lang={lang} texts={both((d) => d.mosaic.colors)} />, ariaLabel: t.mosaic.colors },
            { value: "white", label: <SameWidth lang={lang} texts={both((d) => d.mosaic.white)} />, ariaLabel: t.mosaic.white },
          ]}
        />
      </div>
      <ul className={styles.mosaic} data-mode={mode}>
        {LAYOUT.map(({ slug, paint, columns, rows }) => {
          const entry = entries.find((e) => e.slug === slug);
          if (!entry) return null;
          const vars = paintVars(mode === "white" ? "white" : paint, brand);
          return (
            <li
              key={slug}
              className={styles.tile}
              style={{ "--columns": columns, "--rows": rows, color: vars["--fluid-text"] ?? "var(--text)" } as CSSProperties}
            >
              <Stage slug={slug} loop={entry.loop} vars={vars} className={styles.stage} />
              <h3 className={styles.name}>{entry.name}</h3>
              <PieceLink slug={slug} className={styles.view} label={`${viewLabel}: ${entry.name}`}>
                <SameWidth lang={lang} texts={both((d) => d.mosaic.view)} />
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 3h7v7M13 3 4 12" />
                </svg>
              </PieceLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
