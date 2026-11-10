import { catalog, categoryLabels, promptFor, textsFor } from "@usefluid/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/CodeBlock";
import { CopyButton } from "@/components/CopyButton";
import { Stage } from "@/components/Stage";
import { Tabs } from "@/components/Tabs";
import { highlight, sourceFiles } from "@/lib/highlight";
import { type Lang, both, dictionaries, href, langs } from "@/lib/i18n";
import { SameWidth } from "@/components/SameWidth";
import styles from "../../inner.module.css";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return langs.flatMap((lang) => catalog.map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = catalog.find((e) => e.slug === slug);
  return found ? { title: found.name, description: textsFor(found, lang as Lang).description } : {};
}

export default async function Piece({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = raw as Lang;
  const t = dictionaries[lang];
  const index = catalog.findIndex((e) => e.slug === slug);
  if (index < 0) notFound();
  const entry = catalog[index];
  const texts = textsFor(entry, lang);
  const previous = catalog[index - 1];
  const next = catalog[index + 1];
  const files = await sourceFiles(slug);
  const usage = await highlight(entry.usage, "tsx");
  const prompt = promptFor(entry, lang);

  return (
    <div className={styles.page}>
      <Link href={href(lang, entry.category === "Splash" ? "/splash" : "/components")} className={styles.crumb}>
        {categoryLabels[lang][entry.category]}
      </Link>
      <h1 className={styles.title}>{entry.name}</h1>
      <p className={styles.lead}>{texts.description}</p>
      <Stage slug={slug} loop={entry.loop} className={styles.stage} priority />
      <div className={styles.tabs}>
        <Tabs
          label={t.piece.tabs}
          tabs={[
            { id: "how", label: <SameWidth lang={lang} texts={both((d) => d.piece.how)} />, content: <p className={styles.how}>{texts.how}</p> },
            { id: "usage", label: <SameWidth lang={lang} texts={both((d) => d.piece.usage)} />, content: <CodeBlock name={t.piece.example} code={entry.usage} html={usage} /> },
            { id: "code", label: <SameWidth lang={lang} texts={both((d) => d.piece.code)} />, content: files.map((file) => <CodeBlock key={file.name} {...file} />) },
            {
              id: "prompt",
              label: <SameWidth lang={lang} texts={both((d) => d.piece.prompt)} />,
              content: (
                <div className={styles.prompt}>
                  <div className={styles.promptHead}>
                    <h2>{t.piece.forAgent}</h2>
                    <CopyButton text={prompt} />
                  </div>
                  <p>{prompt}</p>
                </div>
              ),
            },
          ]}
        />
      </div>
      <nav aria-label={t.piece.others} className={styles.pager}>
        {previous ? (
          <Link href={href(lang, `/components/${previous.slug}`)} transitionTypes={["nav-back"]}>
            <SameWidth lang={lang} texts={both((d) => d.piece.previous)} />: {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={href(lang, `/components/${next.slug}`)} transitionTypes={["nav-forward"]}>
            <SameWidth lang={lang} texts={both((d) => d.piece.next)} />: {next.name}
          </Link>
        )}
      </nav>
    </div>
  );
}
