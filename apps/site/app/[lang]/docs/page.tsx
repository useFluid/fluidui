import type { Metadata } from "next";
import { GuidePage, guideTitle } from "@/components/GuidePage";
import type { Lang } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: guideTitle("intro", (await params).lang as Lang) };
}

export default async function Docs({ params }: { params: Promise<{ lang: string }> }) {
  return <GuidePage page="intro" lang={(await params).lang as Lang} />;
}
