import { catalog } from "@usefluid/registry";
import { pieceMarkdown } from "@/lib/docs";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.map(({ slug }) => ({ file: `${slug}.md` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const entry = catalog.find((e) => `${e.slug}.md` === file);
  if (!entry) return new Response("Not found", { status: 404 });
  return new Response(pieceMarkdown(entry.slug, entry.name, entry.description), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
