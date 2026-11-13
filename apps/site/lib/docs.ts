import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export type Prop = { name: string; type: string; fallback: string; text: string };

export type PieceDoc = {
  intro: string;
  example: string;
  props: Prop[];
  access: string;
  notes: string;
  extra: { title: string; body: string }[];
};

const REGISTRY = path.join(process.cwd(), "../../registry");

export const readme = (slug: string) => {
  const file = path.join(REGISTRY, slug, "README.md");
  return existsSync(file) ? readFileSync(file, "utf8").replace(/\r\n/g, "\n") : "";
};

const cell = (s: string) => s.replace(/\\\|/g, "|").trim();

function sections(md: string) {
  const parts = md.split(/^## /m);
  const head = parts.shift() ?? "";
  return {
    intro: head.replace(/^# .*\n/, "").trim(),
    list: parts.map((p) => {
      const [title, ...rest] = p.split("\n");
      return { title: title.trim(), body: rest.join("\n").trim() };
    }),
  };
}

export function pieceDoc(slug: string): PieceDoc {
  const { intro, list } = sections(readme(slug));
  const take = (name: string) => list.find((s) => s.title === name)?.body ?? "";
  const example = take("Example").match(/```tsx\n([\s\S]*?)```/)?.[1]?.trim() ?? "";
  const props = take("Props")
    .split("\n")
    .filter((l) => l.startsWith("|") && !l.startsWith("|---") && !l.startsWith("| Prop"))
    .map((l) => l.slice(1, -1).split(/(?<!\\)\|/).map(cell))
    .map(([name, type, fallback, text]) => ({ name, type, fallback, text }));
  const known = new Set(["Example", "Props", "Keyboard and screen readers", "Notes"]);
  return {
    intro,
    example,
    props,
    access: take("Keyboard and screen readers"),
    notes: take("Notes"),
    extra: list.filter((s) => !known.has(s.title)),
  };
}

export function dependencies(slug: string): string[] {
  const out: string[] = [];
  const visit = (s: string) => {
    const folder = path.join(REGISTRY, s);
    for (const name of readdirSync(folder)) {
      if (name === "demo.tsx" || !/\.tsx?$/.test(name)) continue;
      for (const m of readFileSync(path.join(folder, name), "utf8").matchAll(/from "\.\.\/([a-z-]+)\//g)) {
        if (m[1] !== slug && !out.includes(m[1])) {
          out.push(m[1]);
          visit(m[1]);
        }
      }
    }
  };
  visit(slug);
  return out;
}

export function pieceMarkdown(slug: string, name: string, description: string) {
  const body = readme(slug).replace(/^# .*\n+/, "").trim();
  const install = ["```bash", `npx @usefluid/cli add ${slug}`, "```"].join("\n");
  return `${[`# ${name}`, description, "## Installation", install, body].join("\n\n")}\n`;
}
