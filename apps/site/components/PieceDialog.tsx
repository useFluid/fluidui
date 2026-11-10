"use client";

import { MorphDialog } from "@usefluid/registry/morph-dialog/MorphDialog.tsx";
import Link from "next/link";
import { type MouseEvent, type ReactNode, createContext, useCallback, useContext, useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { CopyButton } from "./CopyButton";
import { Stage } from "./Stage";
import { Tabs } from "./Tabs";
import { type Lang, both, href } from "@/lib/i18n";
import { SameWidth } from "./SameWidth";
import { useLang } from "./LangProvider";
import styles from "./PieceDialog.module.css";

type Piece = {
  slug: string;
  name: string;
  category: string;
  description: string;
  how: string;
  loop: number | null;
  usage: { code: string; html: string };
  files: { name: string; code: string; html: string }[];
  prompt: string;
};

const Context = createContext<(slug: string, from?: HTMLElement) => void>(() => {});
const cache = new Map<string, Promise<Piece>>();

function load(slug: string, lang: Lang) {
  const key = `${lang}/${slug}`;
  if (!cache.has(key)) {
    cache.set(key, fetch(`/api/pieces/${lang}/${slug}`).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    }));
  }
  return cache.get(key)!;
}

export function PieceDialogProvider({ children }: { children: ReactNode }) {
  const { lang, t } = useLang();
  const [slug, setSlug] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<HTMLElement | null>(null);
  const [piece, setPiece] = useState<Piece | null>(null);
  const [failed, setFailed] = useState(false);

  const show = useCallback((next: string, from?: HTMLElement) => {
    setSlug(next);
    setOrigin(from ?? null);
    setPiece(null);
    setFailed(false);
    setOpen(true);
    load(next, lang).then(setPiece, () => setFailed(true));
  }, [lang]);
  const close = useCallback(() => setOpen(false), []);

  return (
    <Context.Provider value={show}>
      {children}
      <MorphDialog open={open} onClose={close} from={origin} labelledBy="piece-title" className={styles.window}>
        {slug && (
          <div className={styles.body}>
            <header className={styles.head}>
              <div>
                <p className={styles.category}>{piece?.category ?? " "}</p>
                <h2 id="piece-title" className={styles.title}>{piece?.name ?? t.dialog.loading}</h2>
              </div>
              <button type="button" className={styles.close} onClick={close} aria-label={t.dialog.close}>
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className={styles.grid}>
              <Stage slug={slug} loop={piece?.loop ?? undefined} className={styles.stage} priority />
              <div className={styles.info}>
                {failed && <p role="alert">{t.dialog.failed}</p>}
                {piece && (
                  <>
                    <p className={styles.description}>{piece.description}</p>
                    <Tabs
                      label={t.piece.tabs}
                      tabs={[
                        { id: "como", label: <SameWidth lang={lang} texts={both((d) => d.piece.how)} />, content: <p className={styles.how}>{piece.how}</p> },
                        { id: "uso", label: <SameWidth lang={lang} texts={both((d) => d.piece.usage)} />, content: <CodeBlock name={t.piece.example} {...piece.usage} /> },
                        { id: "codigo", label: <SameWidth lang={lang} texts={both((d) => d.piece.code)} />, content: piece.files.map((f) => <CodeBlock key={f.name} {...f} />) },
                        {
                          id: "prompt",
                          label: <SameWidth lang={lang} texts={both((d) => d.piece.prompt)} />,
                          content: (
                            <div className={styles.prompt}>
                              <p>{piece.prompt}</p>
                              <CopyButton text={piece.prompt} />
                            </div>
                          ),
                        },
                      ]}
                    />
                    <Link href={href(lang, `/components/${piece.slug}`)} className={styles.page} onClick={close}>
                      {t.dialog.open}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </MorphDialog>
    </Context.Provider>
  );
}

export function PieceLink({ slug, className, children, label }: { slug: string; className?: string; children: ReactNode; label?: string }) {
  const open = useContext(Context);
  const { lang } = useLang();
  return (
    <a
      href={href(lang, `/components/${slug}`)}
      className={className}
      aria-label={label}
      onClick={(e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        const link = e.currentTarget as HTMLElement;
        const tile = link.closest("[data-origin]") ?? link.closest("li") ?? link;
        open(slug, tile as HTMLElement);
      }}
    >
      {children}
    </a>
  );
}
