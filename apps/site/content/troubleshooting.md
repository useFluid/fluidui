# Troubleshooting

Every error and warning Fluid gives has a code. Find it here: what happened, and the fix. In production, messages carry only the code and a link to this page; in development they also explain it.

## FLUID_BOX_MISMATCH

A path given to `MorphPath` does not fit the `viewBox` of its svg. Usually it is an icon from a set drawn in a 24 x 24 box, placed in the 120 x 120 box Fluid's shapes and logos use, so it sits small in the top-left corner and morphs strangely.

Convert the icon once with `scalePath` and keep the 120 box:

```tsx
const check = scalePath(heroiconCheckSolid, 24);

<svg viewBox="0 0 120 120">
  <MorphPath d={done ? check : shapes.circle} />
</svg>;
```

For a logo from any SVG, use `fitPath(d)` instead. This warning only appears in development.

## FLUID_PATH_START

The path does not begin with a move command. Every SVG path starts with `M` or `m`. Pass only the `d` attribute of a `<path>`, starting with `M`.

## FLUID_PATH_NUMBER

A command is missing a number. The path was usually cut when it was copied. Copy the whole `d` attribute again: every command needs all its coordinates.

## FLUID_PATH_FLAG

An arc command (`A` or `a`) has a flag that is not 0 or 1. Re-export the SVG from your design tool, or convert arcs to curves when you export.

## FLUID_PATH_COMMAND

The path has a letter that is not an SVG path command. It usually means the whole SVG markup was passed instead of the `d` attribute. Pass only the `d` value.

## FLUID_PATH_CHARACTER

There is a value where no command expects one, for example text after a `Z`. Pass only the `d` attribute, without extra text.

## FLUID_PATH_EMPTY

The path has commands but draws nothing: no line and no curve. Pass a shape with at least one segment.

## FLUID_PATH_NO_SIZE

`fitPath` got a path with no width or height, such as a single point. Pass a shape with an area.

## FLUID_VIEWBOX

`scalePath` could not read the box. Pass a positive number for a square box, or a viewBox string with four numbers:

```ts
scalePath(icon, 24);
scalePath(icon, "0 0 24 24");
```

## A bad path in MorphPath

`MorphPath` never crashes on a bad `d`. It keeps the last good shape and, in development, warns once with the error's code. Fix the path using the entry above for that code.
