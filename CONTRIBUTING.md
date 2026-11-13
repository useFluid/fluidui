# Contributing

Thanks for helping. Bug reports, new pieces and fixes to the docs are all welcome.

## Setup

```bash
git clone https://github.com/willradoux/fluidui.git
cd fluidui
npm install
npm run dev
```

The site opens at http://localhost:3000 with every piece live.

## Checks

```bash
npm run typecheck
npm test
npm run build && npm run test:e2e
```

The end-to-end tests run on Microsoft Edge through Playwright.

## A new piece

```bash
npm run new -- my-piece
```

This creates `registry/my-piece/` with four files:

| File | What goes in it |
|---|---|
| `MyPiece.tsx` | The component. It reads only the `--fluid-*` variables, never fixed colours. |
| `MyPiece.module.css` | Its styles. |
| `demo.tsx` | What the site shows. Use `useAutoplay` from `demo-context` so it plays on its own. |
| `README.md` | Example, props, keyboard and screen readers, notes. |

Then set its family and texts in `registry/index.ts`, and it shows up on the site, in the CLI and in the prompts page. The catalogue test fails until the README has every section.

## What every piece does

- Wears the brand: colours, radius and font come from the `--fluid-*` variables.
- Goes straight to its final state with reduced motion.
- Has touch targets of at least 44 px and a visible focus ring.
- Works with the keyboard and tells screen readers what changed.
- Fits at 320 px wide.
- Uses the engine for springs and morphs, with no other runtime dependency.

## Style

- TypeScript and CSS modules. No comments in the code: names carry the meaning, and the README explains the rest.
- Small commits with a message that says what changed and why.

## License

By contributing you agree that your work is released under the [MIT License](LICENSE).
