
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";

const FORMATS = {
  story: [1080, 1920],
  post: [1080, 1350],
  square: [1080, 1080],
  wide: [1920, 1080],
};

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
if (!slug) {
  console.error("Use: npm run record -- <piece> [--format story|post|square|wide] [--brand fluid|orbe|cais|vento] [--background accent|hot|lime|ink|paper|sky|white] [--seconds 6] [--fps 60] [--url http://127.0.0.1:3000]");
  process.exit(1);
}

const format = flag("format", "story");
const [width, height] = FORMATS[format] ?? FORMATS.story;
const seconds = Number(flag("seconds", 6));
const fps = Number(flag("fps", 60));
const base = flag("url", "http://127.0.0.1:3000");
const brand = flag("brand", "fluid");
const paint = flag("background", "accent");
const scale = Math.min(width, height) / 400;
const out = flag("out", join("videos", `${slug}-${format}-${brand}.mp4`));

const frames = mkdtempSync(join(tmpdir(), "fluid-"));
const browser = await chromium.launch({ channel: flag("browser", "msedge") });
const page = await browser.newPage({
  viewport: { width: Math.round(width / scale), height: Math.round(height / scale) },
  deviceScaleFactor: scale,
});

await page.clock.install({ time: 0 });
await page.goto(`${base}/record/${slug}?brand=${brand}&background=${paint}`);
await page.locator("[data-recording]").waitFor();
await page.evaluate(() => document.fonts.ready);
await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 20);
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
  if (i % fps === 0) {
    const clock = await page.evaluate(() => Math.round(performance.now()));
    process.stdout.write(`\r${Math.round((i / total) * 100)}%${process.env.FLUID_DEBUG ? ` clock ${clock} ms, frame ${Math.round(i * step)} ms\n` : ""}`);
  }
}
await browser.close();

mkdirSync("videos", { recursive: true });
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(frames, "%05d.png"),
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", out,
]);
rmSync(frames, { recursive: true, force: true });
console.log(`\rDone: ${out} (${width}x${height}, ${seconds}s, ${fps} fps)`);
