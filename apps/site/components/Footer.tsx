import Link from "next/link";
import { type Lang, both, dictionaries, href } from "@/lib/i18n";
import { REPO_URL } from "@/lib/site";
import { SameWidth } from "./SameWidth";
import { BigMark } from "./BigMark";
import { CopyButton } from "./CopyButton";
import styles from "./Footer.module.css";

const INSTALL = "npm i @usefluid/motion";

export function Footer({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];
  const columns: { title: string; links: [string, string][] }[] = [
    {
      title: t.footer.library,
      links: [
        [t.nav.components, "/components"],
        [t.nav.splash, "/splash"],
        [t.nav.prompts, "/prompts"],
        [t.nav.docs, "/docs"],
        ["GitHub", REPO_URL],
      ],
    },
    {
      title: t.footer.pieces,
      links: [
        ["Splash Choice", "/components/splash-choice"],
        ["Shape Morph", "/components/shape-morph"],
        ["Menu Morph", "/components/menu-morph"],
        ["Pet", "/components/pet"],
      ],
    },
  ];
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div>
          <h2 className={styles.title}>{t.footer.title}</h2>
          <p className={styles.text}>{t.footer.text}</p>
          <div className={styles.actions}>
            <Link href={href(lang, "/components")} className={styles.primary}>{t.hero.primary}</Link>
            <div className={styles.install}>
              <code>{INSTALL}</code>
              <CopyButton text={INSTALL} />
            </div>
          </div>
        </div>
        <nav aria-label={t.footer.label} className={styles.columns}>
          {columns.map((col) => (
            <div key={col.title}>
              <p className={styles.colTitle}>{col.title}</p>
              <ul>
                {col.links.map(([label, path]) => (
                  <li key={path}>{path.startsWith("http") ? <a href={path}>{label}</a> : <Link href={href(lang, path)}>{label}</Link>}</li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className={`container ${styles.word}`} aria-hidden>
        <BigMark className={styles.wordMark} />
        <span>fluid</span>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>{t.footer.bottom}</p>
        <a href="#content" className={styles.top2}><SameWidth lang={lang} texts={both((d) => d.footer.top)} /></a>
      </div>
    </footer>
  );
}
