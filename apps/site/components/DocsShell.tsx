import { catalog, categories, categoryLabels } from "@usefluid/registry";
import { CatalogNav } from "./CatalogNav";
import styles from "./DocsShell.module.css";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const groups = categories
    .map((category) => ({
      category: { en: categoryLabels.en[category], pt: categoryLabels.pt[category] },
      pieces: catalog.filter((e) => e.category === category).map(({ slug, name }) => ({ slug, name })),
    }))
    .filter((g) => g.pieces.length);
  return (
    <div className={`container ${styles.shell}`}>
      <CatalogNav groups={groups} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
