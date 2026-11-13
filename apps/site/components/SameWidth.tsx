import type { ReactNode } from "react";
import { langs, type Lang } from "@/lib/i18n";
import styles from "./SameWidth.module.css";

export function SameWidth({ lang, texts, start }: { lang: Lang; texts: Record<Lang, ReactNode>; start?: boolean }) {
  return (
    <span className={styles.same} data-start={start || undefined}>
      {langs.map((l) => (
        <span key={l} aria-hidden={l === lang ? undefined : true} data-off={l === lang ? undefined : ""}>
          {texts[l]}
        </span>
      ))}
    </span>
  );
}
