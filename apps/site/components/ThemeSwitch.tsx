"use client";

import { SegmentedPicker } from "@usefluid/registry/segmented-picker/SegmentedPicker.tsx";
import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

type Choice = "light" | "dark" | "auto";

const KEY = "fluid-theme";
let remembered: Choice | null = null;

function apply(choice: Choice) {
  const dark = choice === "dark" || (choice === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  const html = document.documentElement;
  html.dataset.switching = "";
  (window as Window & { __fluidTheme?: string }).__fluidTheme = dark ? "dark" : "light";
  html.dataset.theme = dark ? "dark" : "light";
  requestAnimationFrame(() => requestAnimationFrame(() => delete html.dataset.switching));
}

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d={d} />
  </svg>
);

const SUN = "M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.3 6.3 5.2 5.2M18.8 18.8l-1.1-1.1M6.3 17.7l-1.1 1.1M18.8 5.2l-1.1 1.1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z";
const MOON = "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z";

export function ThemeSwitch() {
  const { t } = useLang();
  const [choice, setChoice] = useState<Choice>(() => remembered ?? "auto");
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
    }
    remembered = stored === "light" || stored === "dark" ? stored : "auto";
    setChoice(remembered);
  }, []);

  useEffect(() => {
    if (choice !== "auto") return;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("auto");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [choice]);

  return (
    <SegmentedPicker
      label={t.theme.label}
      value={choice}
      onChange={(next) => {
        const c = next as Choice;
        remembered = c;
        setChoice(c);
        apply(c);
        try {
          if (c === "auto") localStorage.removeItem(KEY);
          else localStorage.setItem(KEY, c);
        } catch {
        }
      }}
      options={[
        { value: "light", label: icon(SUN), ariaLabel: t.theme.light },
        { value: "dark", label: icon(MOON), ariaLabel: t.theme.dark },
        { value: "auto", label: t.theme.auto, ariaLabel: t.theme.autoLabel },
      ]}
    />
  );
}
