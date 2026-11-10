"use client";

import { useEffect, useState } from "react";
import { both } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { SameWidth } from "./SameWidth";
import styles from "./CopyButton.module.css";

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const { lang, t } = useLang();
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 1600);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <button
      type="button"
      className={styles.copy}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState("done");
        } catch {
          setState("failed");
        }
      }}
    >
      <span aria-live="polite">{state === "done" ? t.copy.copied : state === "failed" ? t.copy.failed : (label ?? <SameWidth lang={lang} texts={both((d) => d.copy.copy)} />)}</span>
    </button>
  );
}
