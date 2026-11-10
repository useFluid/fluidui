"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type Lang, both, href, visiblePath } from "@/lib/i18n";
import { SameWidth } from "./SameWidth";
import { useLang } from "./LangProvider";
import styles from "./CatalogNav.module.css";

type Group = { category: Record<Lang, string>; pieces: { slug: string; name: string }[] };

export function CatalogNav({ groups }: { groups: Group[] }) {
  const { lang, t } = useLang();
  const path = visiblePath(usePathname(), lang);
  const all = href(lang, "/components");
  const total = groups.reduce((n, g) => n + g.pieces.length, 0);
  const router = useRouter();
  const warm = (to: string) => () => router.prefetch(to);
  return (
    <nav aria-label={t.catalog.label} className={styles.nav}>
      <Link href={all} className={styles.all} aria-current={path === all ? "page" : undefined}>
        <SameWidth lang={lang} texts={both((d) => d.catalog.all)} /> <span>{total}</span>
      </Link>
      {groups.map((group) => (
        <div key={group.category.en} className={styles.group}>
          <p className={styles.title}><SameWidth lang={lang} texts={group.category} /></p>
          <ul>
            {group.pieces.map((piece) => {
              const link = href(lang, `/components/${piece.slug}`);
              return (
                <li key={piece.slug}>
                  <Link href={link} prefetch={false} onPointerEnter={warm(link)} onPointerDown={warm(link)} onFocus={warm(link)} className={styles.link} aria-current={path === link ? "page" : undefined}>
                    {piece.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
