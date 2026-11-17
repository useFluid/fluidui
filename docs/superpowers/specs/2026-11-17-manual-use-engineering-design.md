# Fluid by hand: manual use and engineering foundation

## Intent

Fluid launched and the first real feedback is about using it without an AI agent. People who write their own code like that Fluid is independent of GSAP, but they hit walls the skills hide from AI users. The clearest case: a developer morphed a 24 x 24 icon into a Fluid shape, which lives in a 120 x 120 box, and the morph broke silently. The fix exists (`fitPath`), but nothing told him.

Goal of this phase: someone writing Fluid by hand gets the same quality as someone using the skills, and the project gets the engineering rules that keep that quality as it grows.

## Goals

1. A hand-written morph between any two paths works or explains itself. Mixing coordinate boxes (a Lucide icon and `shapes.circle`) either works directly or produces a clear message that says how to fix it.
2. Mistakes never fail silently or crash the page. Invalid paths and common misuse give a development-time message that names the problem and the fix.
3. The common cases take a few lines and need no knowledge of the 120 box:
   - morph an icon from any icon set into another icon or a shape;
   - put a spring on a value;
   - copy a piece and change it.
4. A docs track for people working without AI: a step-by-step start, recipes for the common cases, a troubleshooting page listing every error message and its fix, and a reference for every public export.
5. Engineering foundation:
   - one lint and format tool, run in CI;
   - a written rules document for code and public API;
   - a size budget for the engine, enforced in CI;
   - tests for the React bindings.

## Non-goals (this phase)

- New pieces, dashboard animations, pet redesign, site redesign and brand showcases. They are the next phases, in that order.
- Publishing the pieces as an importable package. The copy model of the CLI stays.
- A `fluid diff` or update command for copied pieces.
- Faster video recording.

## Anti-goals

- Breaking existing users. Every current export, prop and default keeps its behaviour. New behaviour is opt-in or additive. Paths already in a 120 box, including small ones like `shapes.dot`, must not be resized.
- Adding a runtime dependency to `@usefluid/motion`. It stays at zero.
- Growing the engine noticeably. Development-only checks and messages must not ship in production builds.
- Rules nobody follows. Every rule in the rules document is either checked by a tool or short enough to remember.

## Constraints

- Monorepo, npm workspaces: `packages/motion` (engine, about 7 KB gzip today), `packages/cli`, `registry` (pieces), `apps/site` (static Next.js export on Render).
- TypeScript strict, ES2022, React 18 or newer as an optional peer.
- No code comments; names carry meaning, READMEs explain the rest (current rule in CONTRIBUTING).
- English only in the repository.
- CI must stay green: types, unit tests, build, end-to-end tests in Edge and WebKit. Releases go out through GitHub releases with npm trusted publishing.
- Releases follow semantic versioning. This phase is additive, so it ships as 0.2.0.

## Approaches considered

- **A. Foundation first.** Lint, rules, tests and budgets before any user-facing change. Solid, but weeks with nothing visible while launch attention is high.
- **B. Manual use first, engineering alongside.** Start from the feedback; add rules, lint and tests as each part is touched. Improves what people feel now; the foundation arrives gradually.
- **C. Full written audit first.** Complete picture, slowest to any improvement.

**Chosen: B, starting with a thin slice of A.** Willian asked for my recommendation and accepted it. The thin slice is the lint and format tool, the rules document and the size budget, because they are quick and every later change benefits from them. Everything else follows the feedback.

## Decisions

### Foundation slice (first)

- **Lint and format: Biome.** One fast tool for both, one config file, no plugin set to maintain. *My call*: ESLint plus Prettier would also work but means two tools and more config. Applied to the whole repo in one formatting commit so later diffs stay readable. CI runs `biome ci`.
- **Rules document: `ENGINEERING.md` at the root**, linked from CONTRIBUTING. Covers:
  - public API naming;
  - props conventions (controlled pairs like `value` and `onChange`, `className` passthrough);
  - what every piece must do (already in CONTRIBUTING, moved here);
  - error messages (what went wrong plus how to fix it);
  - development-only code;
  - size budget;
  - testing expectations;
  - semantic versioning and the changelog.
- **Size budget.** *My call*: measure what users actually ship.
  - A script bundles the engine with esbuild (a dev dependency only) in production mode, minified, and reports gzip sizes for two entry points: `@usefluid/motion` and `@usefluid/motion/react`.
  - CI fails above the budget.
  - The baseline is measured before this phase starts, and the budget is that baseline plus 15 percent.
  - Development-only code is excluded by construction, and the check also proves it is dropped.
- **Existing pieces are exempt from a retrofit.** *My call*: the rules in `ENGINEERING.md` apply to new code and to any piece a change touches. The document says so explicitly. Existing pieces keep their props and defaults. `ShapeMorph`, `IconMorph` and other pieces are not changed in this phase; they already work in the 120 box.

### Manual use

- **Coordinate boxes are stated per path, at the call site.** *My call*: a public helper rescales one path from its own viewBox into the 120 box, keeping relative size and position (unlike `fitPath`, which fills the box and would blow `shapes.dot` up). The documented pattern is: convert icons once with the helper, draw in `viewBox="0 0 120 120"`, and morph freely against built-in shapes and logos. `MorphPath` itself gets no box prop: a prop would apply to every `d` it receives and wrongly rescale the built-in shapes when one component alternates between an icon and a shape. Both helpers are documented side by side. Name and signature are left to the builder.
- **Development warning for mismatched boxes.** *My call*: in development only, `MorphPath` reads the enclosing `<svg>` `viewBox`. If a path's bounds are far smaller than that box, or fall outside it, `MorphPath` warns once and names the helper. Comparing against the box, not shape against shape, keeps intentional dot-to-logo morphs quiet. The threshold is left to the builder.
- **Invalid paths no longer crash.** `MorphPath` catches a `PathError` and keeps the last good shape. In development it warns with the full message.
- **Errors have codes.** *My call*, following React's model: every `PathError` carries a short stable code (for example `FLUID_PATH_NO_SIZE`). Production builds keep only the code and a link to the Troubleshooting page. Development builds add the full explanation and the fix. Troubleshooting is organised by code.
- **Development-only code** is gated so bundlers drop it in production. *My call*: `process.env.NODE_ENV !== "production"`, guarded so it does not throw where `process` is undefined (plain ESM in a browser without a bundler).
- **Docs, a "Without AI" track on the site**:
  - "Start by hand": install, theme, first spring, first morph, in under ten minutes;
  - recipes: morph icons from Lucide or Heroicons, morph to your logo, a spring on any value, copy a piece and adapt it;
  - "Troubleshooting": every error and warning message, its cause and its fix;
  - reference: every public export with its types and an example.
  
  Pages follow the existing guide system in `apps/site/lib/guide.ts` and are also served as Markdown for agents.
- **The "Without AI" track is English only.** Willian decided this. The Portuguese routes of these pages show the English text, so the language switch keeps working and no page is missing, and their sidebar links stay in place. Existing Portuguese content elsewhere on the site is not touched in this phase.

### Tests

- Unit tests for the new path helper and the improved error messages, in the existing Vitest setup.
- Tests for `MorphPath` in a DOM environment: rescaling, the mismatch warning, the invalid path fallback, and reduced motion. *My call*: add `happy-dom` as a dev dependency for Vitest. It does not touch any published package.
- An end-to-end test that runs the "Start by hand" recipe on the site: a 24 x 24 icon morphing into a built-in shape renders without errors.

## Success criteria

- The case from the feedback, a 24 x 24 icon morphing to `shapes.circle`, works with one documented change, and without it shows a warning that names that change.
- A developer can follow "Start by hand" without AI and get a working morph and spring.
- CI fails on lint errors, unformatted code, or an engine over the size budget.
- Existing pieces, the site and all current tests behave exactly as before.

## Left to the builder

- Names and signatures of the new helper and the new `MorphPath` option, following the rules in `ENGINEERING.md`.
- The mismatch threshold and how often the warning repeats.
- Biome rule selection, as long as the existing code passes after the formatting commit without behaviour changes.
- Order of work inside each slice, and how to split it into pull requests.
