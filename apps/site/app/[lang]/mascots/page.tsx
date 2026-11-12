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

export default async function Mascots({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const m = dictionaries[lang].mascots;
  const code = await highlight(CODE, "tsx");
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
    </div>
  );
}
