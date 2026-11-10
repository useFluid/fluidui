import { catalog, categories, categoryLabels } from "@usefluid/registry";
import { CatalogNav } from "@/components/CatalogNav";
import styles from "./layout.module.css";

export default async function CatalogLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  await params;
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
