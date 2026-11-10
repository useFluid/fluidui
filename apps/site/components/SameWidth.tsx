import type { ReactNode } from "react";
import { langs, type Lang } from "@/lib/i18n";
import styles from "./SameWidth.module.css";

export function SameWidth({ lang, texts }: { lang: Lang; texts: Record<Lang, ReactNode> }) {
  return (
    <span className={styles.same}>
      {langs.map((l) => (
        <span key={l} aria-hidden={l === lang ? undefined : true} data-off={l === lang ? undefined : ""}>
          {texts[l]}
        </span>
      ))}
    </span>
  );
}
