import { catalog, categories, categoryLabels } from "@usefluid/registry";
import type { Metadata } from "next";
import { Wall } from "@/components/Wall";
import { type Lang, dictionaries } from "@/lib/i18n";
import styles from "../inner.module.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: dictionaries[(await params).lang as Lang].components.title };
}

export default async function Components({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = dictionaries[lang];
  const groups = categories.filter((c) => catalog.some((e) => e.category === c));
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t.components.title}</h1>
      <p className={styles.lead}>{t.components.lead(catalog.length)}</p>
      {groups.map((category) => {
        const id = category.toLowerCase();
        const entries = catalog.filter((e) => e.category === category);
        return (
          <section key={category} id={id} className={styles.group} aria-labelledby={`t-${id}`}>
            <h2 id={`t-${id}`} className={styles.groupTitle}>
              {categoryLabels[lang][category]} <sup>{String(entries.length).padStart(2, "0")}</sup>
            </h2>
            <Wall entries={entries} lang={lang} />
          </section>
        );
      })}
    </div>
  );
}
