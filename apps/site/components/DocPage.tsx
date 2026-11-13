import type { ReactNode } from "react";
import { CopyButton } from "./CopyButton";
import { Toc, type TocItem } from "./Toc";
import styles from "./DocPage.module.css";

type Props = {
  eyebrow?: ReactNode;
  title: string;
  lead: string;
  toc: TocItem[];
  tocLabel: string;
  markdown?: { text: string; button: string };
  children: ReactNode;
};

export function DocPage({ eyebrow, title, lead, toc, tocLabel, markdown, children }: Props) {
  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <header className={styles.head}>
          {eyebrow}
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{title}</h1>
            {markdown && <CopyButton text={markdown.text} label={markdown.button} />}
          </div>
          <p className={styles.lead}>{lead}</p>
        </header>
        {children}
      </article>
      {toc.length > 1 && (
        <aside className={styles.aside}>
          <Toc items={toc} label={tocLabel} />
        </aside>
      )}
    </div>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <h2 id={id} className={styles.h2}>{title}</h2>
      {children}
    </section>
  );
}
