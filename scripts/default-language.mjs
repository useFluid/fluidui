import { copyFileSync, cpSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const out = path.resolve(process.argv[2] ?? "apps/site/out");
const english = path.join(out, "en");

if (!existsSync(english)) {
  console.error(`No English pages in ${out}. Run the site build first.`);
  process.exit(1);
}

cpSync(english, out, { recursive: true, force: false, errorOnExist: false });
console.log(`English pages are now also served from the root of ${out}`);

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? files(full) : [full];
  });
}

let flattened = 0;
function flattenSegments(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of files(full)) {
        const target = path.join(dir, [name, ...path.relative(full, file).split(path.sep)].join("."));
        if (!existsSync(target)) {
          copyFileSync(file, target);
          flattened++;
        }
      }
    } else {
      flattenSegments(full);
    }
  }
}

flattenSegments(out);
console.log(`${flattened} prefetch files also written with dotted names, as the router requests them`);
