---
name: fluid-brand
description: Sets up a project's brand for Fluid motion pieces - finds the logo, colours and font, converts the logo to the path the pieces use, and writes the --fluid-* theme. Use before adding any Fluid piece, or when someone asks to put their brand, logo or colours into animations.
---

# Fluid brand

Every Fluid piece reads ten CSS variables and a logo as one SVG path in a 120 x 120 box. This skill finds those in the project and writes them in one place. Do it once per project.

## 1. Look before asking

- **Logo:** search `public/`, `assets/`, `src/assets/`, `app/` and any component named `Logo` for SVG files. Prefer the symbol on its own (no wordmark) and a one-colour version.
- **Colours:** look for tokens: `tokens.css`, `globals.css`, `tailwind.config.*`, `theme.ts`, CSS variables like `--primary`, `--brand`, `--accent`. The brand's strongest colour becomes `--fluid-accent`.
- **Font:** the `font-family` on `body`, or what `next/font` or `@font-face` loads.
- **Dark mode:** check whether the project has one and how it switches (`.dark`, `[data-theme]`, media query).

If there is no SVG logo, **ask for one**. Never invent a logo, never use a generic icon, never use another company's logo.

## 2. Convert the logo

```bash
npx @usefluid/cli logo path/to/logo.svg --out src/lib/logo.ts
```

This reads paths, circles, rectangles and polygons, joins them and fits them into the 120 box. It prints how many parts the logo has; holes and several parts are fine.

If it refuses because of `transform`, the SVG must be exported again with transforms applied and strokes outlined (Figma: select, Flatten, Outline stroke). If the logo is text or a raster image, ask for a vector version.

## 3. Write the theme

```bash
npx @usefluid/cli init --out src/styles/fluid-theme.css
```

Then fill in the values from step 1 and import the file once at the root of the app:

| Variable | What it is |
|---|---|
| `--fluid-accent` | the brand colour; fills buttons, pills and logos |
| `--fluid-on-accent` | text and icons on top of the accent; must reach 4.5:1 contrast with it |
| `--fluid-surface` | background of cards and panels |
| `--fluid-surface-2` | background behind the pieces |
| `--fluid-text`, `--fluid-text-2` | main and secondary text; secondary still needs 4.5:1 |
| `--fluid-border` | hairlines |
| `--fluid-focus` | focus ring |
| `--fluid-radius` | the project's control radius |
| `--fluid-font` | the project's font stack |

If the project has dark mode, repeat the values that change under the selector the project already uses.

Check contrast for every text pair. A light brand colour (yellow, light blue) usually needs dark `--fluid-on-accent`.

## 4. Show it

Tell the person where each value came from and which ones you chose because you found nothing. Then show the logo arriving in a `ShapeMorph` (`npx @usefluid/cli add shape-morph`) so they can see it is right.
