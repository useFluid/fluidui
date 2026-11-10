import { type Command, parsePath, serializePath } from "@usefluid/motion";
import { brands } from "@usefluid/registry/brands.ts";

export const MARK = brands.find((b) => b.id === "fluid")!.logo;

const commands = parsePath(MARK);

export function waveMark(t: number, amp: number) {
  const y = (x: number, v: number) =>
    v + amp * Math.sin(x * 0.075 - t * 3.2) * (0.35 + 0.65 * Math.sin((x / 120) * Math.PI));
  return serializePath(
    commands.map((c): Command =>
      c.c === "M" ? { c: "M", x: c.x, y: y(c.x, c.y) }
      : c.c === "Z" ? c
      : { c: "C", x1: c.x1, y1: y(c.x1, c.y1), x2: c.x2, y2: y(c.x2, c.y2), x: c.x, y: y(c.x, c.y) },
    ),
  );
}
