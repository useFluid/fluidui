"use client";

import { useBrand } from "./BrandProvider";
import { type Paint, paintVars } from "./Mosaic";
import { Stage } from "./Stage";

export function PaintedStage({ slug, paint, loop, className }: { slug: string; paint: Paint; loop?: number; className?: string }) {
  const { brand } = useBrand();
  return <Stage slug={slug} loop={loop} vars={paintVars(paint, brand)} className={className} priority />;
}
