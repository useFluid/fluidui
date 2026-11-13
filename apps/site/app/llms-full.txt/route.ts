import { catalog } from "@usefluid/registry";
import { pieceMarkdown } from "@/lib/docs";

export const dynamic = "force-static";

export function GET() {
  const text = catalog.map((e) => pieceMarkdown(e.slug, e.name, e.description)).join("\n---\n\n");
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
