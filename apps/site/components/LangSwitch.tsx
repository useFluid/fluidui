"use client";

import { SegmentedPicker } from "@usefluid/registry/segmented-picker/SegmentedPicker.tsx";
import { usePathname, useRouter } from "next/navigation";
import { type Lang, swapLang } from "@/lib/i18n";
import { useLang } from "./LangProvider";

type Doc = Document & { startViewTransition?: (o: { update: () => Promise<void>; types: string[] }) => unknown };

function languageIs(code: string) {
  return new Promise<void>((resolve) => {
    const html = document.documentElement;
    if (html.lang === code) return resolve();
    const done = () => {
      observer.disconnect();
      clearTimeout(timer);
      resolve();
    };
    const observer = new MutationObserver(() => { if (html.lang === code) done(); });
    observer.observe(html, { attributes: true, attributeFilter: ["lang"] });
    const timer = setTimeout(done, 1000);
  });
}

export function LangSwitch() {
  const { lang, t } = useLang();
  const path = usePathname();
  const router = useRouter();
  return (
    <SegmentedPicker
      label={t.language.label}
      value={lang}
      onChange={(next) => {
        const go = () => router.push(swapLang(path, next as Lang), { scroll: false, transitionTypes: ["lang"] });
        const doc = document as Doc;
        if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return go();
        doc.startViewTransition({
          types: ["lang"],
          update: () => {
            go();
            return languageIs(next === "pt" ? "pt-BR" : "en");
          },
        });
      }}
      options={[
        { value: "en", label: "EN", ariaLabel: "English" },
        { value: "pt", label: "PT", ariaLabel: "Português" },
      ]}
    />
  );
}
