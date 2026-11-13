import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage, guideTitle } from "@/components/GuidePage";
import { GUIDE, type GuidePage as Page } from "@/lib/guide";
import { type Lang, langs } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return langs.flatMap((lang) => GUIDE.filter((page) => page !== "intro").map((page) => ({ lang, page })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, page } = await params;
  return GUIDE.includes(page as Page) ? { title: guideTitle(page as Page, lang as Lang) } : {};
}

export default async function Guide({ params }: Props) {
  const { lang, page } = await params;
  if (!GUIDE.includes(page as Page) || page === "intro") notFound();
  return <GuidePage page={page as Page} lang={lang as Lang} />;
}
