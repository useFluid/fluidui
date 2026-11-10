import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const slug = process.argv[2];
if (!slug || !/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error("Usage: npm run new -- my-piece (lowercase letters, digits and hyphens)");
  process.exit(1);
}

const registry = join(dirname(fileURLToPath(import.meta.url)), "..", "registry");
const folder = join(registry, slug);
if (existsSync(folder)) {
  console.error(`Already exists: registry/${slug}`);
  process.exit(1);
}

const name = slug.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
const title = slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

mkdirSync(folder);
writeFileSync(
  join(folder, `${name}.tsx`),
  `"use client";

import styles from "./${name}.module.css";

export function ${name}() {
  return <div className={styles.root}>${title}</div>;
}
`,
);
writeFileSync(
  join(folder, `${name}.module.css`),
  `.root {
  color: var(--fluid-text);
  font-family: var(--fluid-font);
}
`,
);
writeFileSync(
  join(folder, "demo.tsx"),
  `"use client";

import { useAutoplay } from "../demo-context";
import { ${name} } from "./${name}";

export default function Demo() {
  useAutoplay(() => {}, 1500);
  return <${name} />;
}
`,
);
writeFileSync(
  join(folder, "README.md"),
  `# ${name}

One sentence about what it does.

## Example

\`\`\`tsx
import { ${name} } from "./${name}";

<${name} />
\`\`\`

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|

## Keyboard and screen readers

What a keyboard user and a screen reader get, and what happens with reduced motion.
`,
);

function edit(file, change) {
  const path = join(registry, file);
  const source = readFileSync(path, "utf8");
  const next = change(source);
  if (next === source) {
    console.error(`Could not update registry/${file}`);
    process.exit(1);
  }
  writeFileSync(path, next);
}

const texts = {
  description: "One sentence about the piece.",
  how: "How the piece is made: which spring, which shape, and what happens with the keyboard and screen readers.",
  task: "What the agent should do with the piece.",
};

edit("index.ts", (source) =>
  source.replace(
    /\n\];\n/,
    `
  {
    slug: "${slug}",
    name: "${title}",
    category: "Controls",
    size: "m",
    usage: \`<${name} />\`,
    description: "${texts.description}",
    how: "${texts.how}",
    task: "${texts.task}",
    pt: {
      description: "${texts.description}",
      how: "${texts.how}",
      task: "${texts.task}",
    },
  },
];
`,
  ),
);

edit("demos.tsx", (source) => {
  const imports = [...source.matchAll(/^import .*;$/gm)];
  const last = imports[imports.length - 1];
  const at = last.index + last[0].length;
  const withImport = `${source.slice(0, at)}\nimport ${name}Demo from "./${slug}/demo";${source.slice(at)}`;
  return withImport.replace(/\n};\s*$/, `\n  "${slug}": ${name}Demo,\n};\n`);
});

console.log(`Created registry/${slug}. Set its category and texts in registry/index.ts.`);
