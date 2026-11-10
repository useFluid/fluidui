---
name: fluid-splash
description: Builds a product opening (splash, intro) in the Fluid style - shapes morph into the person's logo, the logo rises, and the headline comes out of a blur. Use when someone asks for an intro, splash screen, opening animation or loading screen with their logo.
---

# Fluid opening

## Pick a model

```bash
npx @usefluid/cli add splash-choice    # or splash-shapes, splash-dots
```

- **SplashChoice:** shapes, logo, rise, and a picker where each option sends the logo into another shape and swaps the headline's word. For products with several areas or audiences.
- **SplashShapes:** shapes, logo, rise, a headline with changing words and one button. For a single call to action.
- **SplashDots:** scattered dots fly to the logo's outline, it fills in and the name comes in. For brands where the name matters.

## Build it

1. Make sure the brand is set (`fluid-brand`): the logo must be a path in a 120 box.
2. Write the words with the person. Short: a headline of up to three words and swap words of up to two.
3. Pick the route of shapes. Prefer shapes that relate to what the brand does over the defaults.
4. Show it on the first screen, once per visit: remember in `sessionStorage` that it played and show the final state straight away next time.
5. Let people skip: any tap or key goes to the final state.

## Timing

- One shape every 0.3 to 0.45 s. Faster reads as flicker; slower drags.
- The logo holds for about 0.7 s before it rises.
- The whole thing is free for interaction in under 5 s.

## Check

- Without JavaScript and with reduced motion, the final screen shows at once and works.
- Nothing in the final content can be clicked before it is visible.
- At 320 px wide nothing is cut off or scrolls sideways.
