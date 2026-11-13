import type { ReactNode } from "react";
import { highlight } from "@/lib/highlight";
import { CodeBlock } from "./CodeBlock";
import styles from "./Markdown.module.css";

type Block =
  | { kind: "code"; lang: string; code: string }
  | { kind: "table"; rows: string[][] }
  | { kind: "list"; items: string[] }
  | { kind: "text"; text: string };

function blocks(md: string): Block[] {
  const out: Block[] = [];
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "tsx";
      const code: string[] = [];
      while (++i < lines.length && !lines[i].startsWith("```")) code.push(lines[i]);
      out.push({ kind: "code", lang, code: code.join("\n") });
    } else if (line.startsWith("|")) {
      const rows: string[][] = [];
      for (; i < lines.length && lines[i].startsWith("|"); i++) {
        if (!/^\|[-| ]+\|$/.test(lines[i])) rows.push(lines[i].slice(1, -1).split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, "|").trim()));
      }
      i--;
      out.push({ kind: "table", rows });
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      for (; i < lines.length && lines[i].startsWith("- "); i++) items.push(lines[i].slice(2));
      i--;
      out.push({ kind: "list", items });
    } else if (line.trim()) {
      const text: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].trim() && !/^(```|\||- )/.test(lines[i + 1])) text.push(lines[++i]);
      out.push({ kind: "text", text: text.join(" ") });
    }
  }
  return out;
}

export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<code key={m.index}>{m[1]}</code>);
    else if (m[2]) parts.push(<strong key={m.index}>{m[2]}</strong>);
    else parts.push(<a key={m.index} href={m[4]}>{m[3]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const LANGS = { tsx: "tsx", ts: "tsx", css: "css", bash: "bash", sh: "bash" } as const;

export async function Markdown({ source, name = "Example" }: { source: string; name?: string }) {
  const list = blocks(source);
  const rendered = await Promise.all(
    list.map(async (b, i) => {
      if (b.kind === "code") {
        const lang = LANGS[b.lang as keyof typeof LANGS] ?? "tsx";
        return <CodeBlock key={i} name={lang === "bash" ? "Terminal" : lang === "css" ? "CSS" : name} code={b.code} html={await highlight(b.code, lang)} />;
      }
      if (b.kind === "table") {
        const [head, ...rows] = b.rows;
        return (
          <div key={i} className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>{head.map((c, j) => <th key={j} scope="col"><Inline text={c} /></th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r, j) => (
                  <tr key={j}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      if (b.kind === "list") return <ul key={i}>{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ul>;
      return <p key={i}><Inline text={b.text} /></p>;
    }),
  );
  return <div className={styles.md}>{rendered}</div>;
}
