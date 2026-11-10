# Fluid

Open-source motion for React, built on one idea: outlines that flow on real springs. Shapes become your logo, pills flow between options, words come out of a blur, and windows grow out of the card that opened them. Every piece wears your logo, colours and font.

Fluid has three parts:

- **An engine**, `@usefluid/motion`: closed-form springs and **Metamorph**, contour morphing between any two shapes or logos. No dependencies.
- **Pieces** you copy into your project with the CLI: openings, controls, characters, text and transitions, all made with the engine.
- **Agent skills** that teach your coding agent to set up your brand, pick and adapt pieces, build new ones and record them as video.

> The packages are not on npm yet. Everything below runs from this repository.

## Pieces

| Family | Pieces |
|---|---|
| Metamorph | Shape Morph, Icon Morph, Menu Morph, Morph Dialog, Morph Button, Copy Morph, Morph Loader |
| Characters | Pet, Bot |
| Controls | Segmented Picker, Pill Tabs, Spring Switch, Spring Button, Morph Island |
| Text | Word Cycle, Text Reveal |
| Transitions | Logo Wipe, Island Toast |
| Splash | Splash Choice, Splash Shapes, Splash Dots |

Every piece reads ten `--fluid-*` CSS variables, has 44 px touch targets and a visible focus ring, and goes straight to its final state when the system asks for reduced motion.

## Using it in a project

```bash
npm i @usefluid/motion
npx @usefluid/cli init --out src/styles/fluid-theme.css
npx @usefluid/cli logo logo.svg --out src/lib/logo.ts
npx @usefluid/cli add splash-choice morph-dialog
```

- `init` writes the theme file with the ten variables.
- `logo` converts an SVG logo into the single path, in a 120 x 120 box, that the pieces use.
- `add` copies pieces into `src/components/fluid/`, with any piece they depend on. From then on they are your code.
- `record <url>` records any page as an MP4, frame by frame at 60 fps, in story, post, square or wide format. It needs `playwright-core`, Chrome or Edge, and `ffmpeg`.

The engine on its own:

```tsx
import { shapes } from "@usefluid/motion";
import { MorphPath, useSpring } from "@usefluid/motion/react";

<svg viewBox="0 0 120 120">
  <MorphPath d={open ? logo : shapes.circle} fill="currentColor" />
</svg>;

useSpring({ x: open ? 200 : 0 }, ({ x }) => {
  el.current.style.transform = `translateX(${x}px)`;
});
```

See [packages/motion](packages/motion/README.md) and [packages/cli](packages/cli/README.md) for the full API.

## Agent skills

```bash
npx skills@latest add willradoux/Fluid-UI
```

| Skill | For |
|---|---|
| `fluid-brand` | Finds the logo, colours and font, and writes the theme |
| `fluid-components` | Picks the right piece and adapts it |
| `fluid-metamorph` | Builds new pieces with the engine |
| `fluid-splash` | Builds a product opening from the logo |
| `fluid-characters` | Pets and bots with moods tied to the product |
| `fluid-video` | Records pages and pieces as video |
| `fluid-ai-video` | Puts brand motion over AI-generated video |

## Repository

```
packages/motion/   the engine
packages/cli/      the fluid CLI
registry/          the pieces: one folder per piece, with its component, CSS and demo
  index.ts         the catalogue: name, family, texts and agent prompt of each piece
  brands.ts        the example brands used in demos
skills/            the agent skills
apps/site/         the docs and showcase site, in English and Portuguese
scripts/           packaging, recording and scaffolding
```

## Development

```bash
npm install
npm run dev            # the site at http://localhost:3000
npm test               # engine and catalogue
npm run typecheck
npm run build && npm run test:e2e
npm run new -- my-piece
node scripts/build-packages.mjs
```

`npm run new` creates `registry/my-piece/` and registers it; set its family and texts in `registry/index.ts` and it shows up on the site. The end-to-end tests run on Microsoft Edge. `build-packages` builds the engine and the CLI into `dist/` and packs them into `pack/`.

## License

[MIT](LICENSE)
