import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "packages/motion/dist");
const budget = JSON.parse(readFileSync(join(root, "size-budget.json"), "utf8"));
const MARKER = "FLUID_DEV_ONLY";

if (!existsSync(join(dist, "index.js"))) {
  console.error("Build the packages first: node scripts/build-packages.mjs");
  process.exit(1);
}

let failed = false;
for (const entry of ["index", "react"]) {
  const result = await build({
    entryPoints: [join(dist, `${entry}.js`)],
    bundle: true,
    minify: true,
    format: "esm",
    write: false,
    external: ["react"],
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "silent",
  });
  const code = result.outputFiles[0].contents;
  const bytes = gzipSync(code, { level: 9 }).length;
  const limit = budget[entry];
  const over = bytes > limit;
  const leaked = Buffer.from(code).toString("utf8").includes(MARKER);
  console.log(`${entry}: ${bytes} B gzip (budget ${limit} B)${over ? "  OVER BUDGET" : ""}${leaked ? "  DEVELOPMENT TEXT IN PRODUCTION" : ""}`);
  if (over || leaked) failed = true;
}
process.exit(failed ? 1 : 0);
