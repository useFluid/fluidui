import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERSION = "0.1.0";
const links = (directory) => ({
  homepage: "https://fluidui.willradoux.com",
  repository: { type: "git", url: "git+https://github.com/willradoux/fluidui.git", directory },
  bugs: { url: "https://github.com/willradoux/fluidui/issues" },
});
const node = (script, args, cwd = root) => execFileSync(process.execPath, [script, ...args], { cwd, stdio: "inherit" });
const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
const npm = [join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js"), join(dirname(process.execPath), "..", "lib", "node_modules", "npm", "bin", "npm-cli.js")].find(existsSync);
if (!npm) throw new Error("Could not find npm next to this Node.js");

const clean = (dir) => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
};

function fixDeclarations(dir) {
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".d.ts")) continue;
    const file = join(dir, name);
    writeFileSync(file, readFileSync(file, "utf8").replace(/from "(\.\/[^"]+)\.tsx?"/g, 'from "$1.js"'));
  }
}

const motion = join(root, "packages/motion");
const motionDist = join(motion, "dist");
clean(motionDist);
node(tsc, ["-p", "packages/motion/tsconfig.build.json"]);
fixDeclarations(motionDist);
cpSync(join(motion, "theme.css"), join(motionDist, "theme.css"));
cpSync(join(motion, "README.md"), join(motionDist, "README.md"));
cpSync(join(root, "LICENSE"), join(motionDist, "LICENSE"));
writeFileSync(
  join(motionDist, "package.json"),
  JSON.stringify(
    {
      name: "@usefluid/motion",
      version: VERSION,
      description: "Exact springs and Metamorph contour morphing for any logo. No dependencies.",
      license: "MIT",
      type: "module",
      sideEffects: ["*.css"],
      exports: {
        ".": { types: "./index.d.ts", default: "./index.js" },
        "./react": { types: "./react.d.ts", default: "./react.js" },
        "./theme.css": "./theme.css",
      },
      peerDependencies: { react: ">=18" },
      peerDependenciesMeta: { react: { optional: true } },
      keywords: ["animation", "spring", "morph", "svg", "react", "motion", "logo"],
      ...links("packages/motion"),
    },
    null,
    2,
  ),
);

const cli = join(root, "packages/cli");
const cliDist = join(cli, "dist");
clean(cliDist);
cpSync(join(cli, "src/fluid.mjs"), join(cliDist, "fluid.mjs"));
cpSync(motionDist, join(cliDist, "motion"), { recursive: true, filter: (src) => !/\.(d\.ts|css|md|json)$|LICENSE$/.test(src) });

const { catalog } = await import(pathToFileURL(join(root, "registry/index.ts")).href);
const pieces = catalog.map((entry) => {
  const folder = join(root, "registry", entry.slug);
  const files = readdirSync(folder)
    .filter((name) => name !== "demo.tsx")
    .map((name) => ({ name, content: readFileSync(join(folder, name), "utf8").replace(/\r\n/g, "\n") }));
  const dependencies = [...new Set(files.flatMap((f) => [...f.content.matchAll(/from "\.\.\/([a-z-]+)\//g)].map((m) => m[1])))];
  return {
    slug: entry.slug,
    name: entry.name,
    category: entry.category,
    description: entry.description,
    usage: entry.usage,
    dependencies,
    files,
  };
});
const theme = readFileSync(join(motion, "theme.css"), "utf8").replace(/\r\n/g, "\n");
writeFileSync(join(cliDist, "registry.json"), JSON.stringify({ version: VERSION, theme, pieces }));
cpSync(join(cli, "README.md"), join(cliDist, "README.md"));
cpSync(join(root, "LICENSE"), join(cliDist, "LICENSE"));
writeFileSync(
  join(cliDist, "package.json"),
  JSON.stringify(
    {
      name: "@usefluid/cli",
      version: VERSION,
      description: "Add Fluid pieces to your project, set up your brand, convert your logo and record video.",
      license: "MIT",
      type: "module",
      bin: { fluid: "./fluid.mjs" },
      engines: { node: ">=20" },
      peerDependencies: { "playwright-core": ">=1.45" },
      peerDependenciesMeta: { "playwright-core": { optional: true } },
      keywords: ["animation", "components", "cli", "react", "motion"],
      ...links("packages/cli"),
    },
    null,
    2,
  ),
);

const pack = join(root, "pack");
clean(pack);
node(npm, ["pack", "--pack-destination", pack], motionDist);
node(npm, ["pack", "--pack-destination", pack], cliDist);
console.log(`\nBuilt @usefluid/motion and @usefluid/cli ${VERSION}. Tarballs in ./pack:`);
for (const f of readdirSync(pack)) console.log(`  ${f}`);
if (!existsSync(join(cliDist, "registry.json"))) process.exit(1);
