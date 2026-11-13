import { readFileSync } from "node:fs";
import path from "node:path";
import { catalog, categoryLabels, promptFor, textsFor } from "@usefluid/registry";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/CodeBlock";
import { CodeToggle } from "@/components/CodeToggle";
import { CopyButton } from "@/components/CopyButton";
import { DocPage, Section } from "@/components/DocPage";
import { Inline, Markdown } from "@/components/Markdown";
import { Stage } from "@/components/Stage";
import { Tabs } from "@/components/Tabs";
import { dependencies, pieceDoc, readme } from "@/lib/docs";
import { highlight, sourceFiles } from "@/lib/highlight";
import { type Lang, dictionaries, href, langs } from "@/lib/i18n";
import styles from "../../inner.module.css";
import doc from "@/components/DocPage.module.css";
import md from "@/components/Markdown.module.css";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return langs.flatMap((lang) => catalog.map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = catalog.find((e) => e.slug === slug);
  return found ? { title: found.name, description: textsFor(found, lang as Lang).description } : {};
}

const RUNNERS = [
  ["npm", "npx"],
  ["pnpm", "pnpm dlx"],
  ["yarn", "yarn dlx"],
  ["bun", "bunx"],
] as const;

const slugId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function Piece({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = raw as Lang;
  const t = dictionaries[lang];
  const g = t.guide;
  const index = catalog.findIndex((e) => e.slug === slug);
  if (index < 0) notFound();
  const entry = catalog[index];
  const texts = textsFor(entry, lang);
  const previous = catalog[index - 1];
  const next = catalog[index + 1];
  const info = pieceDoc(slug);
  const uses = dependencies(slug);
  const demoCode = readFileSync(path.join(process.cwd(), "../../registry", slug, "demo.tsx"), "utf8").replace(/\r\n/g, "\n");
  const example = info.example || entry.usage;
  const themeCode = `import "@usefluid/motion/theme.css";`;
  const [files, usesFiles, demo, usage, engine, theme] = await Promise.all([
    sourceFiles(slug),
    Promise.all(uses.map(async (u) => ({ slug: u, files: await sourceFiles(u) }))),
    highlight(demoCode, "tsx"),
    highlight(example, "tsx"),
    highlight("npm i @usefluid/motion", "bash"),
    highlight(themeCode, "tsx"),
  ]);
  const commands = await Promise.all(
    RUNNERS.map(async ([name, run]) => {
      const code = `${run} @usefluid/cli add ${slug}`;
      return { name, code, html: await highlight(code, "bash") };
    }),
  );
  const prompt = promptFor(entry, lang);

  const toc = [
    { id: "preview", label: g.preview },
    { id: "installation", label: g.installation },
    { id: "usage", label: g.usage },
    ...info.extra.map((e) => ({ id: slugId(e.title), label: e.title })),
    ...(info.props.length ? [{ id: "api", label: g.api }] : []),
    ...(info.access ? [{ id: "access", label: g.access }] : []),
    ...(info.notes ? [{ id: "notes", label: g.notes }] : []),
    { id: "how", label: g.how },
    { id: "agent", label: g.agent },
  ];

  return (
    <DocPage
      eyebrow={
        <Link href={href(lang, entry.category === "Splash" ? "/splash" : "/components")} className={styles.crumb}>
          {categoryLabels[lang][entry.category]}
        </Link>
      }
      title={entry.name}
      lead={texts.description}
      toc={toc}
      tocLabel={g.onPage}
      markdown={{ text: readme(slug), button: g.copyPage }}
    >
      <Section id="preview" title={g.preview}>
        <Stage slug={slug} loop={entry.loop} className={styles.stage} priority />
        <CodeToggle show={g.viewCode} hide={g.hideCode}>
          <CodeBlock name="demo.tsx" code={demoCode} html={demo} />
        </CodeToggle>
      </Section>

      <Section id="installation" title={g.installation}>
        <Tabs
          label={g.installLabel}
          tabs={[
            {
              id: "command",
              label: g.command,
              content: <Tabs label={g.command} tabs={commands.map((c) => ({ id: c.name, label: c.name, content: <CodeBlock name="Terminal" code={c.code} html={c.html} /> }))} />,
            },
            {
              id: "manual",
              label: g.manual,
              content: (
                <ol className={doc.steps}>
                  <li>
                    <p className={doc.text}>{g.stepEngine}</p>
                    <CodeBlock name="Terminal" code="npm i @usefluid/motion" html={engine} />
                  </li>
                  <li>
                    <p className={doc.text}>{g.stepFiles}</p>
                    {files.map((file) => (
                      <CodeBlock key={file.name} name={`components/fluid/${slug}/${file.name}`} code={file.code} html={file.html} />
                    ))}
                    {usesFiles.length > 0 && <p className={doc.text}>{g.alsoUses}</p>}
                    {usesFiles.flatMap((u) =>
                      u.files.map((file) => <CodeBlock key={`${u.slug}/${file.name}`} name={`components/fluid/${u.slug}/${file.name}`} code={file.code} html={file.html} />),
                    )}
                  </li>
                  <li>
                    <p className={doc.text}>{g.stepTheme}</p>
                    <CodeBlock name="layout.tsx" code={themeCode} html={theme} />
                  </li>
                </ol>
              ),
            },
          ]}
        />
      </Section>

      <Section id="usage" title={g.usage}>
        <CodeBlock name={`${entry.name.replace(/\s/g, "")}.tsx`} code={example} html={usage} />
      </Section>

      {info.extra.map((e) => (
        <Section key={e.title} id={slugId(e.title)} title={e.title}>
          <Markdown source={e.body} name={entry.name.replace(/\s/g, "")} />
        </Section>
      ))}

      {info.props.length > 0 && (
        <Section id="api" title={g.api}>
          {g.english && <p className={doc.text}>{g.english}</p>}
          <div className={md.tableWrap}>
            <table className={`${md.table} ${md.api}`}>
              <thead>
                <tr>
                  <th scope="col">{g.prop}</th>
                  <th scope="col">{g.type}</th>
                  <th scope="col">{g.fallback}</th>
                  <th scope="col">{g.description}</th>
                </tr>
              </thead>
              <tbody>
                {info.props.map((p) => (
                  <tr key={p.name}>
                    <td><code>{p.name}</code></td>
                    <td data-label={g.type} data-empty={p.type ? undefined : ""}>{p.type && <code>{p.type}</code>}</td>
                    <td data-label={g.fallback} data-empty={p.fallback ? undefined : ""}>{p.fallback ? <code>{p.fallback}</code> : "—"}</td>
                    <td><Inline text={p.text} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {info.access && (
        <Section id="access" title={g.access}>
          <Markdown source={info.access} />
        </Section>
      )}

      {info.notes && (
        <Section id="notes" title={g.notes}>
          <Markdown source={info.notes} />
        </Section>
      )}

      <Section id="how" title={g.how}>
        <p className={doc.text}>{texts.how}</p>
      </Section>

      <Section id="agent" title={g.agent}>
        <div className={styles.prompt}>
          <div className={styles.promptHead}>
            <p className={doc.text}>{t.piece.forAgent}</p>
            <CopyButton text={prompt} />
          </div>
          <p>{prompt}</p>
        </div>
      </Section>

      <nav aria-label={t.piece.others} className={styles.pager}>
        {previous ? (
          <Link href={href(lang, `/components/${previous.slug}`)} transitionTypes={["nav-back"]}>
            {t.piece.previous}: {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={href(lang, `/components/${next.slug}`)} transitionTypes={["nav-forward"]}>
            {t.piece.next}: {next.name}
          </Link>
        )}
      </nav>
    </DocPage>
  );
}
