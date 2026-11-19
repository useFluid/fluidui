export type Ranked = { id: string; label: string; value: number };

export function rank<T extends Ranked>(items: T[], order: "desc" | "asc" = "desc"): T[] {
  const sign = order === "desc" ? -1 : 1;
  return items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => sign * (a.item.value - b.item.value) || a.i - b.i)
    .map(({ item }) => item);
}

export function roundLike(value: number, target: number): number {
  const decimals = Number.isFinite(target) ? (String(target).split(".")[1] ?? "").length : 0;
  return Number(value.toFixed(Math.min(decimals, 6)));
}
