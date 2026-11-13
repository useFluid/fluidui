import { catalog } from "@usefluid/registry";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PAGES = ["/", "/components", "/mascots", "/splash", "/prompts", "/docs", ...catalog.map((e) => `/components/${e.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    alternates: { languages: { en: `${SITE_URL}${path === "/" ? "" : path}`, pt: `${SITE_URL}/pt${path === "/" ? "" : path}` } },
  }));
}
