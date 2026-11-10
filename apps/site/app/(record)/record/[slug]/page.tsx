import { catalog } from "@usefluid/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordView } from "@/components/RecordView";

export const metadata: Metadata = { title: "Record", robots: { index: false } };

export function generateStaticParams() {
  return catalog.map(({ slug }) => ({ slug }));
}

export default async function Record({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = catalog.find((e) => e.slug === slug);
  if (!entry) notFound();
  return <RecordView slug={slug} loop={entry.loop} />;
}
