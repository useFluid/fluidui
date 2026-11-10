---
name: fluid-components
description: Use when the project depends on @usefluid/motion or the user names Fluid, and they want to add, choose or adapt a Fluid piece (Metamorph, Pet, Bot, Segmented Picker, Spring Switch, Morph Dialog, Splash...). Not for animation with other libraries (Framer Motion, GSAP, CSS) or projects without Fluid.
---

# Fluid components

Fluid pieces are React components copied into the project, all made from one motion: outlines that flow on real springs. Use them where the motion means something: a state changed, something opened, something arrived.

## Before you start

- No `--fluid-*` theme in the project yet? Do `fluid-brand` first.
- `@usefluid/motion` missing from `package.json`? Install it: `npm i @usefluid/motion`.
- Works in Next.js (App Router or Pages), Vite and Remix. Pieces start with `"use client"` and use CSS Modules.

## Pick the piece

| The product needs | Piece |
|---|---|
| A window that opens from a card or button | `morph-dialog` |
| A mobile menu | `menu-morph` |
| A filter or a view switch over one list | `segmented-picker` |
| Tabs that switch panels, with counts | `pill-tabs` |
| An on and off setting | `spring-switch` |
| Main and secondary buttons | `spring-button` |
| A submit that takes a moment | `morph-button` |
| A notice after an action | `island-toast` |
| Copy a code or link | `copy-morph` |
| A loading state | `morph-loader` |
| Open and close, play and pause icons | `icon-morph` |
| A quick action that opens a small panel | `morph-island` |
| A changing word in a heading | `word-cycle` |
| A heading that arrives letter by letter | `text-reveal` |
| A route or screen change with the brand | `logo-wipe` (`LogoCurtain` for routes) |
| The logo arriving | `shape-morph` |
| An opening | `fluid-splash` |
| A mascot or assistant | `fluid-characters` |

`npx @usefluid/cli list` prints all of them.

## Steps

### 1. Add

```bash
npx @usefluid/cli add morph-dialog segmented-picker
```

Files land in `src/components/fluid/<piece>/` (or `components/fluid/`, or `--dir`), with any piece they use.

### 2. Read the piece's README

Every piece folder has a `README.md` with its props, an example, and what keyboard and screen reader users get. Read it before wiring the piece. Do not guess props.

### 3. Wire it to real state

Drive pieces from the product's real data and events: the real request for `morph-button`, the real filter for `segmented-picker`. Remove every sample text.

**Check:** with the keyboard only, at 320 px wide, in light and dark mode, and with reduced motion on, every state can be reached and read.

## Rules

- Controls never animate by themselves. Characters may breathe and blink; pass `still` where nothing should move.
- Colours come from the `--fluid-*` variables only.
- One showpiece per screen.
- The pieces are the project's code: change them freely, and keep them accessible.

## Common mistakes

| Mistake | Fix |
|---|---|
| `from={ref.current}` on MorphDialog | Keep the opener in state: `onClick={(e) => setFrom(e.currentTarget)}` |
| `LogoWipe` around App Router `children` | Use `LogoCurtain` and `useCurtain`: cover, navigate, uncover on the new path (see its README) |
| `pill-tabs` for a filter | `segmented-picker` is the right semantics for a filter |
| `word-cycle` looping in the product | `loop={false}` |
| A Bot with no way to type | Pass your input as its `children` |

Building something no piece covers? Use `fluid-metamorph`.
