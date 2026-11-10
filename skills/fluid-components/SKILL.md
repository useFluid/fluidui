---
name: fluid-components
description: Adds and adapts Fluid animated pieces in a React project - Metamorph (Shape, Icon, Menu, Dialog, Copy, Morph Button, Loader), characters (Pet, Bot), controls (Segmented Picker, Pill Tabs, Spring Switch, Spring Button, Morph Island), text (Word Cycle, Text Reveal) and transitions (Logo Wipe, Island Toast). Use when someone asks for animation, micro-interactions, or a component that "flows", "morphs" or "springs".
---

# Fluid components

Every piece comes from the same motion: outlines that flow on real springs, shapes that become the logo, a pill that flows, words that come out of a blur. Use that motion where it means something, not as decoration.

## Before you start

1. If there is no `fluid-theme.css` in the project, run the `fluid-brand` skill first.
2. Read the project: React version, framework (Next.js, Vite, Remix), where components live, how CSS is imported. The pieces use CSS Modules, which all of these support.

## Pick by need

| The product needs | Piece |
|---|---|
| A logo that arrives or changes | `shape-morph` |
| Open/close, play/pause icons | `icon-morph` |
| A mobile menu | `menu-morph` |
| A window that opens from a card or button | `morph-dialog` |
| A submit that takes a moment | `morph-button` |
| Copy a code or link | `copy-morph` |
| A loading state | `morph-loader` |
| Filters or short tabs | `segmented-picker`, or `pill-tabs` when each tab has a count |
| An on/off preference | `spring-switch` |
| Main and secondary buttons | `spring-button` |
| A quick action that opens a panel | `morph-island` |
| A headline with a changing word | `word-cycle` |
| A headline that comes in letter by letter | `text-reveal` |
| An important screen change | `logo-wipe` |
| A result notice | `island-toast` |
| A mascot or support chat | `pet`, `bot` (see `fluid-characters`) |
| The product's opening | see `fluid-splash` |

`npx @usefluid/cli list` prints every piece with one line about it.

## Add

```bash
npm i @usefluid/motion
npx @usefluid/cli add segmented-picker morph-button
```

The files are copied into `src/components/fluid/<piece>/` (or `--dir`), together with any piece they import. They are the project's code now: change them freely.

Wire each piece to real data and real actions. No sample text left behind. Use the `--fluid-*` variables; never hard-code colours inside a piece.

In Next.js App Router the pieces are client components (they start with `"use client"`). Import them from server components as usual.

## Rules that do not change

- Touch targets of at least 44 px, and a visible focus ring.
- With `prefers-reduced-motion`, a piece goes straight to its final state. The engine's hooks already do this; do not remove it.
- In the product, nothing loops by itself. Autoplay is only for showcases and videos.
- One showpiece per screen. Too much motion becomes noise.
- Test the states each piece announces with a keyboard and a screen reader.

## Build a new piece in the same style

If nothing fits, build one with the engine and the `fluid-metamorph` skill.

## Mobile

- Hover styles live inside `@media (hover: hover)`, so nothing stays lit after a tap.
- Everything runs on pointer events: mouse, finger and pen behave the same.
- Check every piece at 320 px wide and on a real phone before shipping; the engine is light, but a full-screen morph costs paint on cheap Android phones.
