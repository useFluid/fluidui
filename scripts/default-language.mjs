import { cpSync, existsSync } from "node:fs";
import path from "node:path";

const out = path.resolve(process.argv[2] ?? "apps/site/out");
const english = path.join(out, "en");

if (!existsSync(english)) {
  console.error(`No English pages in ${out}. Run the site build first.`);
  process.exit(1);
}

cpSync(english, out, { recursive: true, force: false, errorOnExist: false });
console.log(`English pages are now also served from the root of ${out}`);
