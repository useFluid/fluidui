import { catalog, categoryLabels, promptFor, textsFor } from "@usefluid/registry";
import { highlight, sourceFiles } from "@/lib/highlight";
import { type Lang, langs } from "@/lib/i18n";

export const dynamic = "force-static";

export function generateStaticParams() {
  return langs.flatMap((lang) => catalog.map(({ slug }) => ({ lang, slug })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: raw, slug } = await params;
  const lang = raw as Lang;
  const entry = catalog.find((e) => e.slug === slug);
  if (!entry || !langs.includes(lang)) return new Response("Not found", { status: 404 });
  const texts = textsFor(entry, lang);
  const [files, usage] = await Promise.all([sourceFiles(slug), highlight(entry.usage, "tsx")]);
  return Response.json({
    slug,
    name: entry.name,
    category: categoryLabels[lang][entry.category],
    description: texts.description,
    how: texts.how,
    loop: entry.loop ?? null,
    usage: { code: entry.usage, html: usage },
    files,
    prompt: promptFor(entry, lang),
  });
}
