import { BrandSwitch } from "./BrandSwitch";
import { dictionaries, type Lang } from "@/lib/i18n";
import styles from "./BrandToolbar.module.css";

export function BrandToolbar({ lang }: { lang: Lang }) {
  return (
    <div className={styles.group}>
      <p className={styles.label} aria-hidden>{dictionaries[lang].brand.label}</p>
      <div className={styles.toolbar}>
        <BrandSwitch />
      </div>
    </div>
  );
}
