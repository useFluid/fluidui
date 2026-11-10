"use client";

import { createContext, useContext } from "react";
import { type Dict, type Lang, dictionaries } from "@/lib/i18n";

const Context = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Context.Provider value={lang}>{children}</Context.Provider>;
}

export function useLang(): { lang: Lang; t: Dict } {
  const lang = useContext(Context);
  return { lang, t: dictionaries[lang] as Dict };
}
