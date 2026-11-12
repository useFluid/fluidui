import { readFileSync } from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

const SLUGS = [...readFileSync(path.join(__dirname, "../../../registry/index.ts"), "utf8").matchAll(/slug: "([a-z-]+)"/g)].map((m) => m[1]);
const PAGES = ["/", "/components", "/mascots", "/splash", "/prompts", "/docs"];
const PT_PAGES = PAGES.map((p) => (p === "/" ? "/pt" : `/pt${p}`));

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return errors;
}

async function walk(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
}

test("the catalog has pieces", () => {
  expect(SLUGS.length).toBeGreaterThanOrEqual(16);
});

for (const url of [...PAGES, ...PT_PAGES, ...SLUGS.map((s) => `/components/${s}`)]) {
  test(`${url} has no errors and no accessibility problems`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(url);
    await walk(page);
    await page.waitForTimeout(6000);
    const axe = await new AxeBuilder({ page }).exclude('[class*="_out"]').exclude('[class*="_in"]').analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const width of [320, 390, 768, 1440]) {
  for (const url of [...PAGES, "/pt"]) {
    test(`${url} does not scroll sideways at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(url);
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test("English is the default and Portuguese lives under /pt", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your brand, in motion.");
  await page.goto("/pt");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A sua marca, em movimento.");
});

test("the language switch keeps you on the same page", async ({ page }) => {
  await page.goto("/components/pet");
  await page.getByRole("radio", { name: "Português" }).click();
  await expect(page).toHaveURL(/\/pt\/components\/pet$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.getByRole("radio", { name: "English" }).click();
  await expect(page).toHaveURL(/\/components\/pet$/);
  await expect(page).not.toHaveURL(/\/pt\//);
});

test("switching language keeps the theme and leaves the navbar still", async ({ page }) => {
  await page.goto("/components");
  await page.getByRole("radio", { name: "Dark theme" }).click();
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");
  const before = await page.getByRole("radio", { name: "Português" }).boundingBox();
  await page.evaluate(() => {
    const w = window as unknown as { themes: string[] };
    w.themes = [];
    new MutationObserver(() => w.themes.push(String(document.documentElement.dataset.theme)))
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  });
  await page.getByRole("radio", { name: "Português" }).click();
  await expect(page).toHaveURL(/\/pt\/components$/);
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Tema escuro" })).toHaveAttribute("aria-checked", "true");
  const themes = await page.evaluate(() => (window as unknown as { themes: string[] }).themes);
  expect(themes.filter((t) => t === "light")).toEqual([]);
  const after = await page.getByRole("radio", { name: "Português" }).boundingBox();
  expect(after?.x).toBe(before?.x);
});

test("the brand chosen on the home page dresses every piece on the site", async ({ page }) => {
  const accent = () => page.locator("main [class*=stage]").first().evaluate((el) => getComputedStyle(el).getPropertyValue("--fluid-accent"));
  await page.goto("/components/shape-morph");
  expect(await accent()).toContain("#11100f");
  await page.goto("/");
  await page.getByRole("radio", { name: "Cais" }).click();
  await page.goto("/components/shape-morph");
  await expect.poll(accent).toContain("#e4572e");
});

test("the navbar marks the current page and switches the theme", async ({ page }) => {
  await page.goto("/splash");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Splash" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("radio", { name: "Dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("radio", { name: "Light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("your own SVG logo becomes the brand, and a bad file is refused", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try your own logo" }).click();
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({ name: "bad.svg", mimeType: "image/svg+xml", buffer: Buffer.from("<svg><script>alert(1)</script></svg>") });
  await expect(page.getByText("This file could not be read")).toBeVisible();
  await input.setInputFiles({
    name: "logo.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="M100 100H900V900H100ZM300 300V700H700V300Z"/></svg>'),
  });
  await expect(page.getByRole("radio", { name: "Your brand" })).toHaveAttribute("aria-checked", "true");
  await page.reload();
  await expect(page.getByRole("radio", { name: "Your brand" })).toHaveAttribute("aria-checked", "true");
});

test("View opens the piece window with its code, and Esc closes it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View: Icon Morph" }).click();
  const dialog = page.getByRole("dialog", { name: "Icon Morph" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/same engine as the logo/)).toBeVisible();
  await dialog.getByRole("tab", { name: "Code" }).click();
  await expect(dialog.getByText("IconMorph.tsx")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("pieces on the wall can be played with", async ({ page }) => {
  await page.goto("/");
  await walk(page);
  const sw = page.getByRole("switch", { name: "Notifications" }).first();
  await sw.scrollIntoViewIfNeeded();
  await sw.click();
  const before = await sw.getAttribute("aria-checked");
  await sw.click();
  await expect(sw).not.toHaveAttribute("aria-checked", before ?? "");
});

test("pieces move on their own, pause when touched and carry on after", async ({ page }) => {
  await page.goto("/components/spring-switch");
  const sw = page.getByRole("switch", { name: "Notifications" }).first();
  const first = await sw.getAttribute("aria-checked");
  await expect.poll(() => sw.getAttribute("aria-checked"), { timeout: 4000 }).not.toBe(first);
  await sw.hover();
  const hovered = await sw.getAttribute("aria-checked");
  await expect.poll(() => sw.getAttribute("aria-checked"), { timeout: 4000 }).not.toBe(hovered);
  await sw.click();
  const held = await sw.getAttribute("aria-checked");
  await page.waitForTimeout(2500);
  expect(await sw.getAttribute("aria-checked")).toBe(held);
  await expect.poll(() => sw.getAttribute("aria-checked"), { timeout: 8000 }).not.toBe(held);
});

test("the recording page shows one piece alone", async ({ page }) => {
  await page.goto("/record/pet?brand=vento&background=lime");
  await expect(page.locator("[data-recording]")).toBeVisible();
  await expect(page.getByRole("navigation")).toHaveCount(0);
});

test("the keyboard works on picker, switch and island", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/components/segmented-picker");
  const stage = page.locator("main");
  await stage.getByRole("radio", { name: "Week" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(stage.getByRole("radio", { name: "Month" })).toHaveAttribute("aria-checked", "true");
  await expect(stage.getByRole("radio", { name: "Month" })).toBeFocused();

  await page.goto("/components/spring-switch");
  const sw = page.getByRole("switch", { name: "Notifications" });
  await sw.focus();
  await page.keyboard.press("Space");
  await expect(sw).toHaveAttribute("aria-checked", "false");

  await page.goto("/components/morph-island");
  const trigger = page.getByRole("button", { name: "New order" });
  await trigger.click();
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await context.close();
});

test("with reduced motion the openings go straight to the final screen", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/components/splash-shapes");
  await page.waitForTimeout(300);
  await expect(page.locator('[data-stage="action"]')).toBeVisible();
  await context.close();
});

test("the pages work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/components/splash-shapes");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Splash Shapes");
  await expect(page.locator("main")).toContainText("Example");
  await context.close();
});

test("copy buttons copy", async ({ page, context, baseURL }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
  await page.goto("/prompts");
  await page.getByRole("button", { name: "Copy" }).first().click();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain("Fluid library");
});
