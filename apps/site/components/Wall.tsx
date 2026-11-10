import { type Entry, textsFor } from "@usefluid/registry";
import { type Lang, both, dictionaries } from "@/lib/i18n";
import { PieceLink } from "./PieceDialog";
import { SameWidth } from "./SameWidth";
import { Stage } from "./Stage";
import styles from "./Wall.module.css";

export function Wall({ entries, lang, headingLevel = "h3" }: { entries: Entry[]; lang: Lang; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const view = dictionaries[lang].mosaic.view;
  return (
    <ul className={styles.wall}>
      {entries.map((entry) => (
        <li key={entry.slug} className={styles.tile} data-size={entry.size}>
          <div className={styles.frame} data-origin>
            <Stage slug={entry.slug} loop={entry.loop} className={styles.stage} />
            <PieceLink slug={entry.slug} className={styles.view} label={`${view}: ${entry.name}`}>
              <SameWidth lang={lang} texts={both((d) => d.mosaic.view)} />
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 3h7v7M13 3 4 12" />
              </svg>
            </PieceLink>
          </div>
          <div className={styles.caption}>
            <Heading className={styles.name}>{entry.name}</Heading>
            <p className={styles.description}>{textsFor(entry, lang).description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
