# Engineering rules

How Fluid is built. These rules apply to new code and to any piece a change touches; existing pieces are not retrofitted. Each rule is either checked by a tool or short enough to remember.

## Public API

- Functions are verbs (`createSpring`, `fitPath`, `scalePath`); values and components are nouns (`springs`, `shapes`, `MorphPath`).
- Controlled state comes in pairs: `value` with `onChange`, `open` with `onOpenChange`. A piece that can run on its own also works uncontrolled.
- Every piece accepts `className` and passes it to its root element.
- New behaviour is additive. Changing what an existing export, prop or default does is a breaking change and needs a major version.
- `@usefluid/motion` has no runtime dependencies. React is an optional peer.

## What every piece does

- Wears the brand: colours, radius and font come from the `--fluid-*` variables.
- Goes straight to its final state with reduced motion.
- Has touch targets of at least 44 px and a visible focus ring.
- Works with the keyboard and tells screen readers what changed.
- Fits at 320 px wide.
- Uses the engine for springs and morphs, with no other runtime dependency.

## Errors and warnings

- Every error the engine throws has a stable code: `FLUID_` followed by an uppercase snake name, such as `FLUID_PATH_NO_SIZE`.
- In production the message is the code and a link to its entry on the troubleshooting page. In development it also says what went wrong and how to fix it, with the fix as code when possible.
- Warnings use the same codes, go through `warnOnce`, and fire once per code and message.
- Every code has an entry on the troubleshooting page, with the code as its anchor.
- Components never crash the page on bad input. They keep their last good state and warn.

## Development-only code

- Anything that exists only to help during development, such as checks, warnings and long explanations, sits behind `isDev()` from `packages/motion/src/dev.ts`.
- Bundlers drop it in production. `npm run size` fails if development text reaches the production bundle.

## Size budget

- `npm run size` bundles each engine entry (`@usefluid/motion` and `@usefluid/motion/react`) minified, in production mode, and checks its gzip size against `size-budget.json`.
- Raising a budget takes a pull request that says why the bytes are worth it.

## Performance

- No allocation inside frame loops: reuse arrays and objects across frames.
- Work that only depends on a path is done once per path, not once per frame.
- Engine changes run `npm run bench` before and after, and the pull request shows both numbers.

## Tests

- Engine: unit tests in `packages/motion/test`, including frame-rate independence for anything that moves.
- React bindings: tests in a DOM environment in `packages/motion/test/*.test.tsx`.
- Pieces: the catalogue test checks every piece has a complete README. The end-to-end tests check every page in Edge and WebKit, with axe for accessibility.
- A bug fix starts with a test that fails without the fix.

## Code style

- TypeScript strict and CSS modules. Biome formats and lints: `npm run format`, `npm run lint`.
- No comments in the code. Names carry the meaning, and the README explains the rest.
- English only in the repository.

## Lint exceptions

These Biome rules are off on purpose:

| Rule                          | Why                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `useExhaustiveDependencies`   | Hooks key effects on computed signatures (a joined list of values) on purpose.                                 |
| `noArrayIndexKey`             | Static lists that never reorder.                                                                               |
| `noDangerouslySetInnerHtml`   | Highlighted code comes from Shiki at build time, never from users.                                             |
| `noSvgWithoutTitle`           | Decorative SVGs are `aria-hidden`; meaningful ones carry `role="img"` and `aria-label`.                        |
| `noStaticElementInteractions` | Containers listen for events that bubble up from their own controls, such as Escape and pointer down to pause. |
| `useSemanticElements`         | Custom radio groups follow the ARIA radiogroup pattern with roving focus.                                      |
| `useAnchorContent`            | Icon links are named with `aria-label`.                                                                        |
| `noImportantStyles`           | Reduced-motion overrides have to beat inline animation styles.                                                 |
| `noNonNullAssertion`          | Used only where the value is guaranteed by construction.                                                       |
| `noDescendingSpecificity`     | CSS modules keep state selectors next to the base rule they change.                                            |

## Versioning

- Semantic versioning. Additive changes are minor and fixes are patches until 1.0.
- Every user-visible change gets a line in `CHANGELOG.md` in the pull request that makes it.
- Releases are GitHub releases. The release workflow publishes both packages with provenance.
