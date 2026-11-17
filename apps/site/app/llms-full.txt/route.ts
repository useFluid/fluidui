import { catalog } from "@usefluid/registry";
import { byHandSource } from "@/components/GuidePage";
import { pieceMarkdown } from "@/lib/docs";
import { BY_HAND } from "@/lib/guide";

export const dynamic = "force-static";

export function GET() {
  const guides = BY_HAND.map((page) => byHandSource(page).trim());
  const pieces = catalog.map((e) => pieceMarkdown(e.slug, e.name, e.description));
  const text = [...guides, ...pieces].join("\n\n---\n\n");
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
