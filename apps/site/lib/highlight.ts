import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createCssVariablesTheme, createHighlighter } from "shiki";

const theme = createCssVariablesTheme({ name: "fluid", variablePrefix: "--code-", fontStyle: true });

const highlighter = createHighlighter({ themes: [theme], langs: ["tsx", "css", "bash"] });

export async function highlight(code: string, lang: "tsx" | "css" | "bash") {
  return (await highlighter).codeToHtml(code.trim(), { lang, theme: "fluid" });
}

export type SourceFile = { name: string; code: string; html: string };

export async function sourceFiles(slug: string): Promise<SourceFile[]> {
  const folder = path.join(process.cwd(), "../../registry", slug);
  const names = readdirSync(folder).filter((n) => n !== "demo.tsx");
  names.sort((a, b) => Number(a.endsWith(".css")) - Number(b.endsWith(".css")));
  return Promise.all(
    names.map(async (name) => {
      const code = readFileSync(path.join(folder, name), "utf8").replace(/\r\n/g, "\n");
      return { name, code, html: await highlight(code, name.endsWith(".css") ? "css" : "tsx") };
    }),
  );
}
