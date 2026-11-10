"use client";

import { PathError, fitPath } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";
import { brands } from "@usefluid/registry/brands.ts";
import { SegmentedPicker } from "@usefluid/registry/segmented-picker/SegmentedPicker.tsx";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { CUSTOM_ID, useBrand } from "./BrandProvider";
import { useLang } from "./LangProvider";
import styles from "./BrandSwitch.module.css";

function readSvgLogo(text: string) {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  if (doc.querySelector("parsererror")) throw new PathError("not svg");
  const paths = Array.from(doc.querySelectorAll("path"));
  if (!paths.length) throw new PathError("no path");
  if (doc.querySelector("path[transform], g[transform]")) throw new PathError("transform");
  return fitPath(paths.map((p) => p.getAttribute("d") ?? "").join(" "), 120);
}

const icon = (d: string) => (
  <svg viewBox="-6 -6 132 132" width="20" height="20" aria-hidden className={styles.icon}>
    <MorphPath d={d} fill="currentColor" />
  </svg>
);

export function BrandSwitch() {
  const { brandId, custom, select, setCustom } = useBrand();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#d6336c");
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setCustom({ logo: readSvgLogo(await file.text()), color });
      setError("");
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof PathError && err.message === "transform"
          ? t.brand.transform
          : t.brand.invalid,
      );
    }
  };

  const options = [
    ...brands.map((b) => ({ value: b.id, label: icon(b.logo), ariaLabel: b.name })),
    ...(custom ? [{ value: CUSTOM_ID, label: icon(custom.logo), ariaLabel: t.brand.yours }] : []),
  ];

  return (
    <div ref={root} className={styles.root}>
      <SegmentedPicker label={t.brand.group} value={brandId} onChange={select} options={options} />
      <button
        ref={toggle}
        type="button"
        className={styles.add}
        aria-expanded={open}
        aria-label={t.brand.add}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden>+</span>
      </button>
      {open && (
        <div className={styles.panel} role="group" aria-label={t.brand.add}>
          <p className={styles.panelTitle}>{t.brand.title}</p>
          <p className={styles.panelText}>{t.brand.text}</p>
          <label className={styles.field}>
            <span>{t.brand.color}</span>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                if (custom) setCustom({ logo: custom.logo, color: e.target.value });
              }}
            />
          </label>
          <label className={styles.upload}>
            <input type="file" accept=".svg,image/svg+xml" className="srOnly" onChange={onFile} />
            {t.brand.choose}
          </label>
          {error && <p role="alert" className={styles.error}>{error}</p>}
        </div>
      )}
    </div>
  );
}
