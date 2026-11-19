export type Slice = { start: number; share: number };

export function slices(values: number[]): Slice[] {
  const clean = values.map((v) => Math.max(0, v));
  const total = clean.reduce((a, b) => a + b, 0);
  let start = 0;
  return clean.map((v) => {
    const share = total > 0 ? v / total : 0;
    const slice = { start, share };
    start += share;
    return slice;
  });
}
