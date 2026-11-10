---
name: fluid-brand
description: Use when a project already depends on @usefluid/motion (or the user asks to set up Fluid) and the logo, colours or font still need to reach the Fluid pieces: no --fluid-* theme file yet, a new logo, or a rebrand. Not for brand work that does not involve Fluid.
---

# Fluid brand

Every Fluid piece reads ten `--fluid-*` CSS variables and takes the logo as one SVG path in a 120 x 120 box. This skill connects the project's existing brand to those two things, once.

**The core idea:** point the Fluid variables at the tokens the project already has. Then there is one source of truth, and dark mode follows by itself.

## Steps

### 1. Find what exists

| Look for | Where |
|---|---|
| Logo (SVG, symbol only, one colour) | `public/`, `assets/`, `src/assets/`, `app/`, components named `Logo` |
| Colour tokens | `globals.css`, `tokens.css`, `tailwind.config.*`, `theme.ts`, variables like `--primary` or `--color-primary` |
| Font | the `font-family` on `body`, `next/font`, `@font-face` |
| Dark mode | `.dark`, `[data-theme]` or a `prefers-color-scheme` query |

No SVG logo? Ask for one. Never draw a logo, use a generic icon, or use another company's mark.

**Check:** you can name the file of the logo and of each token.

### 2. Convert the logo

```bash
npx @usefluid/cli logo public/logo.svg --out src/lib/logo.ts
```

Use the folder the project keeps helpers in (`src/lib`, `lib`, `app/lib`). The CLI creates it if needed.

**Check:** the CLI prints the number of parts. A symbol with a dot and a bar is 2. If it refuses because of `transform`, or the logo is text or a picture, ask for an SVG exported with transforms applied and strokes outlined.

### 3. Write the theme and point it at the project's tokens

```bash
npx @usefluid/cli init --out src/styles/fluid-theme.css
```

Replace every value with the project's own token, and import the file once at the root of the app:

```css
:root {
  --fluid-accent: var(--color-primary);
  --fluid-on-accent: var(--color-primary-contrast);
  --fluid-surface: var(--color-panel);
  --fluid-surface-2: var(--color-bg);
  --fluid-text: var(--color-text);
  --fluid-text-2: var(--color-text-muted);
  --fluid-border: var(--color-border);
  --fluid-focus: var(--color-primary);
  --fluid-radius: var(--radius);
  --fluid-font: var(--font);
}
```

| Variable | Used for |
|---|---|
| `--fluid-accent` | logos, fills, the chosen pill, switches when on |
| `--fluid-on-accent` | text, icons and small shapes on the accent; also switch thumbs |
| `--fluid-surface`, `--fluid-surface-2` | panels, and the area behind pieces |
| `--fluid-text`, `--fluid-text-2` | main and secondary text |
| `--fluid-border`, `--fluid-focus` | hairlines and the focus ring |
| `--fluid-radius`, `--fluid-font` | control radius and font |

A token the project lacks: pick a value and tell the person you chose it.

**Check:** text on accent and secondary text reach 4.5:1 contrast, in light and in dark mode.

## Common mistakes

| Mistake | Fix |
|---|---|
| Copying hex values into the theme | Point at the project's variables, so a rebrand or dark mode changes everything |
| A separate dark block that repeats values | Not needed when the variables point at tokens that switch on the same element, usually `<html>`. If the dark class is on `<body>`, declare the `--fluid-*` block on `body` too |
| Showing the logo touching its box | The fitted path fills the 120 box; draw it with `viewBox="-8 -8 136 136"` for breathing room |
| Assuming a logo with holes broke | Holes need `fill-rule="evenodd"`, which `MorphPath` already sets |

Then add pieces with `fluid-components`.
