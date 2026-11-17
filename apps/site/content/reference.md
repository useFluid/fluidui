# Reference

Every export of `@usefluid/motion` and `@usefluid/motion/react`.

## Springs

| Export                   | Signature and use                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `springs`                | Presets `{ w, z }` for frequency and damping: `snappy`, `soft`, `bouncy`, `firm`.                                                                                         |
| `createSpring`           | `createSpring(initial, config?)` returns `{ value, velocity, target, step(dt), jump(value) }`. Set `target`, call `step(dt)` each frame; it returns `false` once settled. |
| `stepSpring`             | `stepSpring(x, v, target, w, z, dt)` returns `{ x, v }` after `dt` seconds. The exact solution, so it gives the same result at any frame rate.                            |
| `springCss`              | `springCss(config?, samples?)` returns `{ easing, duration, transition(property, delay?) }`: a CSS `linear()` easing that follows the spring.                             |
| `SpringConfig`, `Spring` | Types for the above.                                                                                                                                                      |

## Frame loop

| Export | Signature and use                                                                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `play` | `play(tick)` adds `tick(dt)` to one shared `requestAnimationFrame` loop and returns a function that removes it. Return `false` from the tick to stop. |
| `Tick` | `(dt: number) => boolean \| undefined`.                                                                                                               |

## Paths

| Export                                             | Signature and use                                                                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `shapes`                                           | Built-in paths in a 120 box: `dot`, `circle`, `square`, `capsule`, `triangle`, `flower`, `drop`, `pebble`.                                       |
| `scalePath`                                        | `scalePath(d, from, size = 120)` rescales a path from its box (`24` or `"minX minY width height"`) into the 120 box, keeping its size and place. |
| `fitPath`                                          | `fitPath(d, size = 120, padding = 0)` fills the box with the drawing, centred. For logos.                                                        |
| `parsePath`                                        | `parsePath(d)` returns absolute `M`, `C` and `Z` commands. Lines, quadratics and arcs become cubic curves.                                       |
| `serializePath`                                    | `serializePath(commands)` writes commands back to a `d` string.                                                                                  |
| `sampleContours`                                   | `sampleContours(d, count = 160)` returns each closed part as `count` evenly spaced points, biggest part first.                                   |
| `PathError`                                        | Thrown for a path or box that cannot be read. `code` is one of the codes on [Troubleshooting](/docs/troubleshooting).                            |
| `Command`, `Contour`, `PathErrorCode`, `ShapeName` | Types for the above.                                                                                                                             |

## Morph

| Export          | Signature and use                                                                                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createMorpher` | `createMorpher(initial, config?)` returns `{ to(d), jump(d), step(dt), path() }`. `to` starts a morph, `step` advances it and returns `false` when done, `path` gives the current `d`. |
| `MorpherConfig` | `SpringConfig` plus `points` (default 160) and `spread` (default 0.22, how much the points' speeds differ).                                                                            |
| `Morpher`       | Type for the above.                                                                                                                                                                    |

## React

| Export             | Signature and use                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `MorphPath`        | `<MorphPath d config? onRest? …pathProps />` flows into every new `d`. Keeps the last good shape on a bad `d`.                   |
| `useSpring`        | `useSpring(target, apply, config?)` springs named values and calls `apply(values, velocities)` each frame, without re-rendering. |
| `useSequence`      | `useSequence(times, active?)` returns the index of the latest time in seconds reached: a simple timeline.                        |
| `useInView`        | `useInView(ref, threshold?)` returns `true` once the element has been seen.                                                      |
| `useSkip`          | `useSkip(enabled?, initial?)` returns `true` after the first key or pointer press, to skip an opening.                           |
| `useReducedMotion` | `useReducedMotion()` returns whether the system asks for reduced motion.                                                         |

## Theme

| Export                       | Use                                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `@usefluid/motion/theme.css` | The ten `--fluid-*` variables with defaults: accent, on-accent, surface, surface-2, text, text-2, border, focus, radius, font. |
