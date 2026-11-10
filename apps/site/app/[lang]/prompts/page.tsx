import { catalog, promptFor } from "@usefluid/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { type Lang, dictionaries, href } from "@/lib/i18n";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "Prompts" };

export default async function Prompts({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = dictionaries[lang];
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{t.prompts.title}</h1>
      <p className={styles.lead}>{t.prompts.lead}</p>
      <ul className={styles.prompts}>
        {catalog.map((entry) => {
          const prompt = promptFor(entry, lang);
          return (
            <li key={entry.slug} className={styles.prompt}>
              <div className={styles.promptHead}>
                <h2><Link href={href(lang, `/components/${entry.slug}`)}>{entry.name}</Link></h2>
                <CopyButton text={prompt} />
              </div>
              <p>{prompt}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
