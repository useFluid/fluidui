import { catalog, categories } from "@usefluid/registry";
import { dictionaries } from "@/lib/i18n";
import { GUIDE, guidePath } from "@/lib/guide";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const g = dictionaries.en.guide;
  const lines = [
    "# Fluid",
    "",
    "> Open-source motion for React: outlines that flow on real springs, shapes that become your logo, and pieces that wear your brand through ten --fluid-* CSS variables. The CLI copies pieces into your project; the engine @usefluid/motion has no dependencies.",
    "",
    "## Docs",
    "",
    ...GUIDE.map((page) => `- [${page === "intro" ? g.introTitle : g.pages[page]}](${SITE_URL}${guidePath(page)})`),
    "",
    ...categories.flatMap((category) => {
      const entries = catalog.filter((e) => e.category === category);
      return entries.length ? [`## ${category}`, "", ...entries.map((e) => `- [${e.name}](${SITE_URL}/components/${e.slug}.md): ${e.description}`), ""] : [];
    }),
    "## Optional",
    "",
    `- [Everything in one file](${SITE_URL}/llms-full.txt)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
