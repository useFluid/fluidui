import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import { GUIDE, type GuidePage as Page, guidePath } from "@/lib/guide";
import { highlight } from "@/lib/highlight";
import { type Lang, dictionaries, href } from "@/lib/i18n";
import { REPO } from "@/lib/site";
import { CodeBlock } from "./CodeBlock";
import { DocPage, Section } from "./DocPage";
import { Markdown } from "./Markdown";
import doc from "./DocPage.module.css";
import md from "./Markdown.module.css";

type Part = { id: string; title: string; body: ReactNode };

async function code(source: string, lang: "tsx" | "css" | "bash", name = lang === "bash" ? "Terminal" : lang === "css" ? "fluid-theme.css" : "App.tsx") {
  return <CodeBlock name={name} code={source} html={await highlight(source, lang)} />;
}

function Table({ head, rows }: { head: [string, string]; rows: string[][] }) {
  return (
    <div className={md.tableWrap}>
      <table className={md.table}>
        <thead>
          <tr>
            <th scope="col">{head[0]}</th>
            <th scope="col">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <td><code>{a}</code></td>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const THEME = (font: string) => `:root {
  --fluid-accent: var(--brand-600);
  --fluid-on-accent: #ffffff;
  --fluid-surface: var(--background);
  --fluid-surface-2: var(--muted);
  --fluid-text: var(--foreground);
  --fluid-text-2: var(--muted-foreground);
  --fluid-border: var(--border);
  --fluid-focus: var(--ring);
  --fluid-radius: 14px;
  --fluid-font: ${font}, sans-serif;
}`;

async function parts(page: Page, lang: Lang): Promise<{ title: string; lead: string; parts: Part[] }> {
  const t = dictionaries[lang];
  const g = t.guide;
  const d = t.docs;
  const p = (text: string) => <p className={doc.text}>{text}</p>;
  const n = (text: string) => text.replace(/^\d+\.\s*/, "");
  switch (page) {
    case "intro":
      return {
        title: g.introTitle,
        lead: g.introLead,
        parts: [
          {
            id: "parts",
            title: "Fluid",
            body: (
              <ul className={doc.cards}>
                {g.parts.map(([title, text]) => (
                  <li key={title}>
                    <div className={doc.card}>
                      <strong>{title}</strong>
                      <span>{text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: "principles",
            title: g.principlesTitle,
            body: <ul className={doc.bullets}>{g.principles.map((x) => <li key={x}>{x}</li>)}</ul>,
          },
          {
            id: "next",
            title: g.nextTitle,
            body: (
              <ul className={doc.cards}>
                {GUIDE.filter((x) => x !== "intro").map((x) => (
                  <li key={x}>
                    <Link href={href(lang, guidePath(x))} className={doc.card}>
                      <strong>{g.pages[x]}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          },
        ],
      };
    case "installation":
      return {
        title: g.pages.installation,
        lead: d.lead,
        parts: [
          { id: "status", title: n(d.installTitle), body: <>{p(d.status)}{p(d.installText)}{await code("npm i @usefluid/motion\nnpx @usefluid/cli init --out src/styles/fluid-theme.css", "bash")}</> },
          { id: "logo", title: n(d.logoTitle), body: <>{p(d.logoText)}{await code("npx @usefluid/cli logo logo.svg --out src/lib/logo.ts", "bash")}</> },
          {
            id: "add",
            title: n(d.addTitle),
            body: (
              <>
                {p(d.addText)}
                {await code("npx @usefluid/cli list\nnpx @usefluid/cli add splash-choice morph-button pet", "bash")}
                {await code(`import { MorphButton } from "@/components/fluid/morph-button/MorphButton";\n\n<MorphButton state={state} onClick={send} />;`, "tsx")}
              </>
            ),
          },
        ],
      };
    case "theming":
      return {
        title: g.pages.theming,
        lead: d.themeText,
        parts: [
          { id: "variables", title: n(d.themeTitle), body: await code(THEME(d.font), "css") },
          { id: "logo", title: n(d.logoTitle), body: <>{p(d.logoText)}{await code("npx @usefluid/cli logo logo.svg --out src/lib/logo.ts", "bash")}</> },
        ],
      };
    case "engine": {
      const engine = `import { shapes } from "@usefluid/motion";
import { MorphPath, useSpring } from "@usefluid/motion/react";
import { logo } from "@/lib/logo";

useSpring({ x: open ? 200 : 0 }, ({ x }) => {
  el.current.style.transform = \`translateX(\${x}px)\`;
});

<svg viewBox="0 0 120 120">
  <MorphPath d={open ? logo : shapes.circle} fill="currentColor" />
</svg>;`;
      const readme = readFileSync(path.join(process.cwd(), "../../packages/motion/README.md"), "utf8").replace(/\r\n/g, "\n");
      const body = readme.split(/^## /m).slice(1).filter((s) => !s.startsWith("Licen")).map((s) => {
        const [title, ...rest] = s.split("\n");
        return { id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title: title.trim(), body: <Markdown source={rest.join("\n").trim()} name="Engine" /> };
      });
      return {
        title: g.pages.engine,
        lead: d.engineText,
        parts: [{ id: "overview", title: d.engineName, body: await code(engine, "tsx") }, ...body],
      };
    }
    case "cli":
      return {
        title: g.cliTitle,
        lead: g.cliLead,
        parts: [{ id: "commands", title: g.commandCol, body: <>{await code("npx @usefluid/cli <command>", "bash")}<Table head={[g.commandCol, g.whatCol]} rows={g.commands} /></> }],
      };
    case "skills":
      return {
        title: g.pages.skills,
        lead: g.skillsLead,
        parts: [
          { id: "install", title: g.installation, body: await code(`npx skills@latest add ${REPO}\nnpx skills@latest add ${REPO} --skill fluid-splash`, "bash") },
          { id: "list", title: g.skillCol, body: <Table head={[g.skillCol, g.forCol]} rows={g.skillList} /> },
          { id: "llms", title: g.llmsTitle, body: p(g.llmsText) },
        ],
      };
    case "video":
      return {
        title: g.pages.video,
        lead: d.videoText,
        parts: [{ id: "record", title: n(d.videoTitle), body: await code("npm i -D playwright-core\nnpx @usefluid/cli record http://localhost:3000/intro --format story --seconds 8", "bash") }],
      };
    case "accessibility":
      return {
        title: g.pages.accessibility,
        lead: g.a11yLead,
        parts: [
          { id: "rules", title: g.principlesTitle, body: <ul className={doc.bullets}>{g.a11y.map((x) => <li key={x}>{x}</li>)}</ul> },
          { id: "reduced", title: d.reducedTitle, body: p(d.reducedText) },
        ],
      };
    case "contributing": {
      const source = readFileSync(path.join(process.cwd(), "../../CONTRIBUTING.md"), "utf8").replace(/\r\n/g, "\n");
      const body = source.split(/^## /m).slice(1).map((s) => {
        const [title, ...rest] = s.split("\n");
        return { id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title: title.trim(), body: <Markdown source={rest.join("\n").trim()} /> };
      });
      return { title: g.pages.contributing, lead: g.contributingLead, parts: body };
    }
  }
}

export async function GuidePage({ page, lang }: { page: Page; lang: Lang }) {
  const g = dictionaries[lang].guide;
  const { title, lead, parts: list } = await parts(page, lang);
  return (
    <DocPage title={title} lead={lead} toc={list.map((x) => ({ id: x.id, label: x.title }))} tocLabel={g.onPage}>
      {list.map((x) => (
        <Section key={x.id} id={x.id} title={x.title}>
          {x.body}
        </Section>
      ))}
    </DocPage>
  );
}

export const guideTitle = (page: Page, lang: Lang) => (page === "intro" ? dictionaries[lang].guide.introTitle : dictionaries[lang].guide.pages[page]);
