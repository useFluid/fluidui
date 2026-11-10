import { CopyButton } from "./CopyButton";
import styles from "./CodeBlock.module.css";

export function CodeBlock({ name, code, html }: { name?: string; code: string; html: string }) {
  return (
    <figure className={styles.block}>
      <figcaption className={styles.head}>
        <span className={styles.name}>{name}</span>
        <CopyButton text={code} />
      </figcaption>
      <div className={styles.code} dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
