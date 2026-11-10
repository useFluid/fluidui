import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { highlight } from "@/lib/highlight";
import { type Lang, dictionaries } from "@/lib/i18n";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "Docs" };

const INSTALL = `npm i @usefluid/motion
npx @usefluid/cli init --out src/styles/fluid-theme.css`;

const LOGO = `npx @usefluid/cli logo logo.svg --out src/lib/logo.ts`;

const ADD = `npx @usefluid/cli list
npx @usefluid/cli add splash-choice morph-button pet`;

const USE = `import { MorphButton } from "@/components/fluid/morph-button/MorphButton";

<MorphButton state={state} onClick={send} />;`;

const VIDEO = `npm i -D playwright-core
npx @usefluid/cli record http://localhost:3000/intro --format story --seconds 8`;

const SKILLS = `npx skills@latest add willradoux/Fluid-UI`;

export default async function Docs({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const d = dictionaries[lang].docs;

  const THEME = `:root {
  --fluid-accent: #11100f;
  --fluid-on-accent: #6fc4fd;
  --fluid-surface: #ffffff;
  --fluid-surface-2: #6fc4fd;
  --fluid-text: #11100f;
  --fluid-text-2: rgba(17, 16, 15, 0.74);
  --fluid-border: rgba(17, 16, 15, 0.18);
  --fluid-focus: #11100f;
  --fluid-radius: 14px;
  --fluid-font: ${d.font}, sans-serif;
}`;

  const ENGINE = `import { shapes } from "@usefluid/motion";
import { MorphPath, useSpring } from "@usefluid/motion/react";
import { logo } from "@/lib/logo";

${d.springComment}
useSpring({ x: open ? 200 : 0 }, ({ x }) => {
  el.current.style.transform = \`translateX(\${x}px)\`;
});

${d.morphComment}
<svg viewBox="0 0 120 120">
  <MorphPath d={open ? logo : shapes.circle} fill="currentColor" />
</svg>;`;

  const [install, theme, logo, add, use, engine, video, skills] = await Promise.all([
    highlight(INSTALL, "bash"),
    highlight(THEME, "css"),
    highlight(LOGO, "bash"),
    highlight(ADD, "bash"),
    highlight(USE, "tsx"),
    highlight(ENGINE, "tsx"),
    highlight(VIDEO, "bash"),
    highlight(SKILLS, "bash"),
  ]);
  return (
    <div className={`container ${styles.page} ${styles.doc}`}>
      <h1 className={styles.title}>{d.title}</h1>
      <p className={styles.lead}>{d.lead}</p>
      <div className={styles.status}>
        <p>{d.status}</p>
      </div>

      <h2>{d.installTitle}</h2>
      <p>{d.installText}</p>
      <CodeBlock name="Terminal" code={INSTALL} html={install} />

      <h2>{d.themeTitle}</h2>
      <p>{d.themeText}</p>
      <CodeBlock name="fluid-theme.css" code={THEME} html={theme} />

      <h2>{d.logoTitle}</h2>
      <p>{d.logoText}</p>
      <CodeBlock name="Terminal" code={LOGO} html={logo} />

      <h2>{d.addTitle}</h2>
      <p>{d.addText}</p>
      <CodeBlock name="Terminal" code={ADD} html={add} />
      <CodeBlock name="App.tsx" code={USE} html={use} />

      <h2>{d.engineTitle}</h2>
      <p>{d.engineText}</p>
      <CodeBlock name={d.engineName} code={ENGINE} html={engine} />

      <h2>{d.videoTitle}</h2>
      <p>{d.videoText}</p>
      <CodeBlock name="Terminal" code={VIDEO} html={video} />

      <h2>{d.skillsTitle}</h2>
      <p>{d.skillsText}</p>
      <CodeBlock name="Terminal" code={SKILLS} html={skills} />

      <h2>{d.reducedTitle}</h2>
      <p>{d.reducedText}</p>
    </div>
  );
}
