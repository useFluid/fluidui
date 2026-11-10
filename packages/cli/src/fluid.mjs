#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(join(here, "registry.json"), "utf8"));

const args = process.argv.slice(2);
const command = args[0];
const VALUE_FLAGS = new Set(["dir", "out", "format", "seconds", "fps", "browser"]);
const values = {};
const switches = new Set();
const positional = [];
for (let i = 1; i < args.length; i++) {
  const a = args[i];
  if (!a.startsWith("--")) {
    positional.push(a);
    continue;
  }
  const [name, inline] = a.slice(2).split("=", 2);
  if (VALUE_FLAGS.has(name)) {
    const value = inline ?? args[i + 1];
    if (value === undefined || value.startsWith("--")) {
      console.error(`fluid: --${name} needs a value.`);
      process.exit(1);
    }
    values[name] = value;
    if (inline === undefined) i++;
  } else switches.add(name);
}
const flag = (name, fallback) => values[name] ?? fallback;
const has = (name) => switches.has(name);

const bold = (s) => (process.stdout.isTTY ? `\x1b[1m${s}\x1b[0m` : s);
const dim = (s) => (process.stdout.isTTY ? `\x1b[2m${s}\x1b[0m` : s);
const fail = (message) => {
  console.error(`fluid: ${message}`);
  process.exit(1);
};

const HELP = `${bold("fluid")} ${dim(registry.version)}

  fluid list                         every piece, by family
  fluid add <piece...>               copy pieces into your project (and the pieces they use)
      --dir <path>                   where to put them (default: src/components/fluid or components/fluid)
      --overwrite                    replace files that already exist
  fluid init                         write the theme file with the --fluid-* variables
      --out <file>                   default: src/fluid-theme.css or fluid-theme.css
  fluid logo <file.svg>              turn any SVG logo into the path the pieces use
      --out <file.ts>                also write it as a TypeScript module
  fluid record <url>                 record a page as MP4, frame by frame
      --format story|post|square|wide   default story
      --seconds <n>  --fps <n>       default 6 and 60
      --out <file.mp4>               default fluid-<format>.mp4
      --browser chrome|msedge        default chrome`;


function defaultDir(kind) {
  const src = existsSync("src");
  if (kind === "pieces") return src ? "src/components/fluid" : "components/fluid";
  return src ? "src/fluid-theme.css" : "fluid-theme.css";
}

const SKIP = new Set(["node_modules", "dist", "build", "out", "coverage"]);

function findTheme(dir = ".", depth = 0) {
  if (depth > 5) return null;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP.has(entry.name) || entry.name.startsWith(".")) continue;
      const found = findTheme(path, depth + 1);
      if (found) return found;
    } else if (entry.name.endsWith(".css") && readFileSync(path, "utf8").includes("--fluid-accent")) return path;
  }
  return null;
}

function list() {
  const families = [...new Set(registry.pieces.map((p) => p.category))];
  for (const family of families) {
    console.log(`\n${bold(family)}`);
    for (const p of registry.pieces.filter((x) => x.category === family)) {
      console.log(`  ${p.slug.padEnd(18)} ${dim(p.description)}`);
    }
  }
  console.log(`\n${dim("fluid add <piece>")}`);
}

function withDependencies(slugs) {
  const out = new Set();
  const visit = (slug) => {
    const piece = registry.pieces.find((p) => p.slug === slug);
    if (!piece) fail(`no piece called "${slug}". Run "fluid list" to see them all.`);
    if (out.has(slug)) return;
    out.add(slug);
    piece.dependencies.forEach(visit);
  };
  slugs.forEach(visit);
  return [...out];
}

function add() {
  if (!positional.length) fail('say which pieces, e.g. "fluid add splash-choice pet".');
  const dir = flag("dir", defaultDir("pieces"));
  const slugs = withDependencies(positional);
  const written = [];
  const skipped = [];
  for (const slug of slugs) {
    const piece = registry.pieces.find((p) => p.slug === slug);
    const folder = join(dir, slug);
    mkdirSync(folder, { recursive: true });
    for (const file of piece.files) {
      const target = join(folder, file.name);
      if (existsSync(target) && !has("overwrite")) {
        skipped.push(target);
        continue;
      }
      writeFileSync(target, file.content);
      written.push(target);
    }
  }
  const extra = slugs.filter((s) => !positional.includes(s));
  console.log(`${bold("Added")} ${slugs.join(", ")} ${dim(`to ${dir}`)}`);
  if (extra.length) console.log(dim(`  (${extra.join(", ")} came along because the others use them)`));
  if (skipped.length) console.log(dim(`  kept ${skipped.length} existing file(s); use --overwrite to replace them`));
  const pkg = existsSync("package.json") ? JSON.parse(readFileSync("package.json", "utf8")) : {};
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (!deps["@usefluid/motion"]) console.log(`\nThe pieces run on the engine:\n  ${bold("npm i @usefluid/motion")}`);
  if (!findTheme()) console.log(`\nSet your brand once:\n  ${bold("npx @usefluid/cli init")}`);
  for (const slug of positional) {
    const piece = registry.pieces.find((p) => p.slug === slug);
    console.log(`\n${bold(piece.name)}\n${piece.usage.split("\n").map((l) => `  ${l}`).join("\n")}`);
    console.log(dim(`  Props, keyboard and screen readers: ${join(dir, slug, "README.md")}`));
  }
}

function init() {
  const out = flag("out", defaultDir("theme"));
  if (existsSync(out) && !has("overwrite")) fail(`${out} already exists. Use --overwrite to replace it.`);
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(out, registry.theme);
  console.log(`${bold("Wrote")} ${out}`);
  console.log("Import it once at the root of your app, then point each variable at your own tokens,");
  console.log(`for example ${bold("--fluid-accent: var(--color-primary);")} so dark mode follows by itself.`);
}


const num = (v) => Number.parseFloat(v ?? "0") || 0;
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`))?.[1] ?? tag.match(new RegExp(`\\s${name}\\s*=\\s*'([^']*)'`))?.[1];

function shapeToPath(tag) {
  const kind = tag.match(/^<\s*(\w+)/)[1].toLowerCase();
  if (kind === "path") return attr(tag, "d") ?? "";
  if (kind === "circle" || kind === "ellipse") {
    const cx = num(attr(tag, "cx")), cy = num(attr(tag, "cy"));
    const rx = num(attr(tag, kind === "circle" ? "r" : "rx")), ry = num(attr(tag, kind === "circle" ? "r" : "ry"));
    return `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
  }
  if (kind === "rect") {
    const x = num(attr(tag, "x")), y = num(attr(tag, "y")), w = num(attr(tag, "width")), h = num(attr(tag, "height"));
    const r = Math.min(num(attr(tag, "rx") ?? attr(tag, "ry")), w / 2, h / 2);
    if (!r) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
    return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  }
  if (kind === "polygon" || kind === "polyline") {
    const pts = (attr(tag, "points") ?? "").trim().split(/[\s,]+/).map(Number);
    let d = "";
    for (let i = 0; i + 1 < pts.length; i += 2) d += `${i ? "L" : "M"}${pts[i]} ${pts[i + 1]}`;
    return `${d}Z`;
  }
  return "";
}

async function logo() {
  const file = positional[0];
  if (!file || !existsSync(file)) fail('give an SVG file, e.g. "fluid logo public/logo.svg".');
  const svg = readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  if (/\stransform\s*=/.test(svg)) {
    fail("this SVG uses transform. Export it again with transforms applied (in Figma: Flatten, then Outline stroke).");
  }
  const tags = svg.match(/<\s*(path|circle|ellipse|rect|polygon|polyline)\b[^>]*>/gi) ?? [];
  const d = tags.map(shapeToPath).filter(Boolean).join(" ");
  if (!d) fail("no shapes found. The logo must be drawn with paths or basic shapes, not text or images.");
  const { fitPath, sampleContours } = await import("./motion/index.js");
  let fitted;
  try {
    fitted = fitPath(d, 120);
  } catch (e) {
    fail(`the drawing could not be read: ${e.message}`);
  }
  const parts = sampleContours(fitted).length;
  const out = flag("out");
  if (out) {
    mkdirSync(dirname(resolve(out)), { recursive: true });
    writeFileSync(out, `export const logo =\n  ${JSON.stringify(fitted)};\n`);
    console.log(`${bold("Wrote")} ${out} ${dim(`(${parts} part${parts === 1 ? "" : "s"})`)}`);
  } else {
    console.log(fitted);
    console.error(dim(`\n${parts} part${parts === 1 ? "" : "s"}. Use --out logo.ts to save it as a module.`));
  }
}


const FORMATS = { story: [1080, 1920], post: [1080, 1350], square: [1080, 1080], wide: [1920, 1080] };

async function record() {
  const url = positional[0];
  if (!url) fail('give the address of the page to record, e.g. "fluid record http://localhost:3000/intro".');
  try {
    await import("playwright-core");
  } catch {
    fail("recording needs playwright-core: npm i -D playwright-core");
  }
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
  } catch {
    fail("recording needs ffmpeg on your PATH: https://ffmpeg.org/download.html");
  }
  const format = flag("format", "story");
  if (!FORMATS[format]) fail(`unknown format "${format}". Use story, post, square or wide.`);
  const [width, height] = FORMATS[format];
  const seconds = Number(flag("seconds", 6));
  const fps = Number(flag("fps", 60));
  const out = flag("out", `fluid-${format}.mp4`);
  const scale = Math.min(width, height) / 400;

  const frames = mkdtempSync(join(tmpdir(), "fluid-"));
  try {
    await capture({ url, frames, width, height, scale, seconds, fps, out });
  } finally {
    rmSync(frames, { recursive: true, force: true });
  }
  console.log(`\r${bold("Recorded")} ${out} ${dim(`(${width}x${height}, ${seconds}s, ${fps} fps)`)}`);
}

async function capture({ url, frames, width, height, scale, seconds, fps, out }) {
  const { chromium } = await import("playwright-core");
  const browser = await chromium.launch({ channel: flag("browser", "chrome") });
  const page = await browser.newPage({
    viewport: { width: Math.round(width / scale), height: Math.round(height / scale) },
    deviceScaleFactor: scale,
  });
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    window.__fluidStart = new WeakMap();
  });
  const step = 1000 / fps;
  const total = Math.round(seconds * fps);
  for (let i = 0; i < total; i++) {
    await page.clock.runFor(step);
    await page.evaluate(() => {
      const now = performance.now();
      for (const a of document.getAnimations()) {
        if (!window.__fluidStart.has(a)) window.__fluidStart.set(a, now);
        a.pause();
        a.currentTime = now - window.__fluidStart.get(a);
      }
    });
    await page.screenshot({ path: join(frames, `${String(i).padStart(5, "0")}.png`), animations: "allow", caret: "initial" });
    if (i % fps === 0) process.stdout.write(`\r${Math.round((i / total) * 100)}%`);
  }
  await browser.close();
  mkdirSync(dirname(resolve(out)), { recursive: true });
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(frames, "%05d.png"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", out,
  ]);
}

const commands = { list, add, init, logo, record };
if (!command || command === "help" || command === "--help" || has("help")) {
  console.log(HELP);
  process.exit(0);
}
if (!commands[command]) {
  console.error(`fluid: unknown command "${command}".\n`);
  console.error(HELP);
  process.exit(1);
}
await commands[command]();
