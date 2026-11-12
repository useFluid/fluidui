"use client";

import { useSpring } from "@usefluid/motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { dictionaries, href, visiblePath } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { SameWidth } from "./SameWidth";
import styles from "./Header.module.css";

const PATHS = ["/components", "/mascots", "/splash", "/prompts", "/docs"] as const;

export function NavLinks() {
  const { lang, t } = useLang();
  const path = visiblePath(usePathname(), lang);
  const links = PATHS.map((p) => {
    const key = p.slice(1) as "components" | "mascots" | "splash" | "prompts" | "docs";
    return { href: href(lang, p), texts: { en: dictionaries.en.nav[key], pt: dictionaries.pt.nav[key] } };
  });
  const nav = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ left: number; right: number } | null>(null);
  const placed = useRef(false);

  const active = links.findIndex((l) => path === l.href || path.startsWith(`${l.href}/`));

  useLayoutEffect(() => {
    const measure = () => {
      const el = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
      setBox(el ? { left: el.offsetLeft, right: el.offsetLeft + el.offsetWidth } : null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (nav.current) observer.observe(nav.current);
    return () => observer.disconnect();
  }, [active]);

  const edges = useRef({ left: 0, right: 0 });
  const paint = () => {
    if (!pill.current) return;
    pill.current.style.transform = `translateX(${edges.current.left}px)`;
    pill.current.style.width = `${Math.max(0, edges.current.right - edges.current.left)}px`;
  };
  const movingRight = box ? box.left >= edges.current.left : true;
  const immediate = !placed.current;
  useSpring({ v: box?.left ?? 0 }, ({ v }) => { edges.current.left = v; paint(); }, { ...(movingRight ? { w: 17, z: 0.78 } : { w: 34, z: 0.8 }), immediate });
  useSpring({ v: box?.right ?? 0 }, ({ v }) => { edges.current.right = v; paint(); }, { ...(movingRight ? { w: 34, z: 0.8 } : { w: 17, z: 0.78 }), immediate });
  if (box) placed.current = true;

  return (
    <nav ref={nav} aria-label={t.nav.label} className={styles.nav}>
      <span ref={pill} className={styles.navPill} data-on={box ? "" : undefined} aria-hidden />
      {links.map((link, i) => (
        <Link key={link.href} href={link.href} className={styles.link} aria-current={i === active ? "page" : undefined}>
          <SameWidth lang={lang} texts={link.texts} />
        </Link>
      ))}
    </nav>
  );
}
