import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { fitPath, sampleContours } from "../packages/motion/src/index";
import { brands } from "./brands";
import { catalog, categories, promptFor } from "./index";

const root = __dirname;
const folders = readdirSync(root, { withFileTypes: true })
  .filter((f) => f.isDirectory() && f.name !== "node_modules")
  .map((f) => f.name);

describe("catalog", () => {
  it("lists every folder, and every entry has a folder", () => {
    expect(catalog.map((e) => e.slug).sort()).toEqual([...folders].sort());
  });

  it("gives every piece a demo that is registered", () => {
    const demos = readFileSync(join(root, "demos.tsx"), "utf8");
    for (const { slug } of catalog) {
      expect(existsSync(join(root, slug, "demo.tsx")), slug).toBe(true);
      expect(demos, slug).toContain(`./${slug}/demo`);
    }
  });

  it("documents every piece with an example, props and accessibility", () => {
    for (const { slug } of catalog) {
      const path = join(root, slug, "README.md");
      expect(existsSync(path), slug).toBe(true);
      const text = readFileSync(path, "utf8");
      for (const heading of ["## Example", "## Props", "## Keyboard and screen readers"]) expect(text, `${slug} ${heading}`).toContain(heading);
    }
  });

  it("has complete texts", () => {
    for (const entry of catalog) {
      expect(categories).toContain(entry.category);
      expect(entry.description.length, entry.slug).toBeGreaterThan(20);
      expect(entry.how.length, entry.slug).toBeGreaterThan(60);
      expect(promptFor(entry)).toContain(entry.name);
    }
  });

  it("moves every demo on its own, either by autoplay or by a loop", () => {
    for (const entry of catalog) {
      const demo = readFileSync(join(root, entry.slug, "demo.tsx"), "utf8");
      const component = readdirSync(join(root, entry.slug)).map((n) => readFileSync(join(root, entry.slug, n), "utf8")).join();
      const moves = entry.loop || demo.includes("useAutoplay") || /setInterval/.test(component);
      expect(moves, entry.slug).toBeTruthy();
    }
  });
});

describe("example brands", () => {
  it("have logos that cover the hard cases", () => {
    const parts = brands.map((b) => sampleContours(fitPath(b.logo, 120)).length);
    expect(parts).toEqual([1, 3, 1, 2]);
  });
});
