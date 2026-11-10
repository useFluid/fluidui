import { catalog } from "@usefluid/registry";
import type { Metadata } from "next";
import { Wall } from "@/components/Wall";
import { type Lang, dictionaries } from "@/lib/i18n";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "Splash" };

export default async function Splash({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = dictionaries[lang];
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{t.splash.title}</h1>
      <p className={styles.lead}>{t.splash.lead}</p>
      <div className={styles.wide}>
        <Wall headingLevel="h2" lang={lang} entries={catalog.filter((e) => e.category === "Splash")} />
      </div>
    </div>
  );
}
