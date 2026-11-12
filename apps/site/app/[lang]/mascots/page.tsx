import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { MascotGallery, MascotGenerator } from "@/components/MascotLab";
import { highlight } from "@/lib/highlight";
import { type Lang, dictionaries } from "@/lib/i18n";
import styles from "../inner.module.css";

export const metadata: Metadata = { title: "Mascots" };

const CODE = `npx @usefluid/cli add mascot

import { Mascot } from "@/components/fluid/mascot/Mascot";
import { pickObject } from "@/components/fluid/mascot/objects";

const object = pickObject("we run a small coffee shop");

<Mascot object={object} mood={saved ? "happy" : "idle"} follow color="var(--fluid-accent)" />`;

const COLOUR = `<Mascot object="mug" color="#ff5a1f" />
<Mascot object="mug" color="var(--brand-500)" />
<Mascot object="mug" color={paid ? "#16a34a" : "var(--fluid-accent)"} />

<Pet color="#7c3aed" />
<Bot color="#0ea5e9" state={state} messages={messages} />

:root {
  --fluid-accent: #ff5a1f;
}`;

export default async function Mascots({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const m = dictionaries[lang].mascots;
  const code = await highlight(CODE, "tsx");
  const colour = await highlight(COLOUR, "tsx");
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>{m.title}</h1>
      <p className={styles.lead}>{m.lead}</p>
      <div className={styles.wide}>
        <MascotGenerator />
      </div>
      <h2>{m.gallery}</h2>
      <p>{m.galleryText}</p>
      <div className={styles.wide}>
        <MascotGallery />
      </div>
      <h2>{m.use}</h2>
      <CodeBlock name="Mascot" code={CODE} html={code} />
      <h2>{m.colourTitle}</h2>
      <p>{m.colourText}</p>
      <CodeBlock name="Colour" code={COLOUR} html={colour} />
    </div>
  );
}
