import Link from "next/link";
import { type Lang, dictionaries, href } from "@/lib/i18n";
import { GitHubLink } from "./GitHubLink";
import { LangSwitch } from "./LangSwitch";
import { Mark } from "./Mark";
import { NavLinks } from "./NavLinks";
import { SameWidth } from "./SameWidth";
import { ThemeSwitch } from "./ThemeSwitch";
import styles from "./Header.module.css";

export function Header({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];
  return (
    <header className={styles.header}>
      <div className={`container ${styles.wrap}`}>
        <div className={styles.bar}>
          <Link href={href(lang, "/")} className={styles.name} aria-label={t.nav.home}>
            <Mark size={30} />
            <span aria-hidden>fluid</span>
          </Link>
          <NavLinks />
          <div className={styles.tools}>
            <div className={styles.switches}>
              <LangSwitch />
              <ThemeSwitch />
            </div>
            <GitHubLink label={t.nav.github} />
            <Link href={href(lang, "/docs")} className={styles.cta}><SameWidth lang={lang} texts={{ en: dictionaries.en.nav.start, pt: dictionaries.pt.nav.start }} /></Link>
          </div>
        </div>
      </div>
    </header>
  );
}
