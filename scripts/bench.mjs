import { brands } from "../registry/brands.ts";
import { createMorpher, sampleContours, shapes, springCss, springs, stepSpring } from "../packages/motion/src/index.ts";

const LOGO = brands[0].logo;
const RING_AND_DOT = "M60 20a40 40 0 1 0 0 80a40 40 0 1 0 0-80ZM60 40a20 20 0 1 1 0 40a20 20 0 1 1 0-40ZM105 15a8 8 0 1 0 0 16a8 8 0 1 0 0-16Z";

function moving(from, to) {
  const m = createMorpher(from, springs.soft);
  let flip = false;
  m.to(to);
  return () => {
    if (!m.step(1 / 60)) {
      flip = !flip;
      m.to(flip ? from : to);
    }
    m.path();
  };
}

function measure(name, fn) {
  for (let i = 0; i < 200; i++) fn();
  const samples = [];
  for (let round = 0; round < 7; round++) {
    let runs = 0;
    const start = performance.now();
    while (performance.now() - start < 150) {
      fn();
      runs++;
    }
    samples.push((runs * 1000) / (performance.now() - start));
  }
  samples.sort((a, b) => a - b);
  const median = samples[3];
  console.log(`${name.padEnd(44)} ${Math.round(median).toLocaleString("en-US").padStart(12)} ops/s`);
  return median;
}

const stepMany = () => {
  let x = 0;
  let v = 0;
  for (let i = 0; i < 1000; i++) {
    const r = stepSpring(x, v, 100, 17, 0.58, 1 / 60);
    x = r.x;
    v = r.v;
  }
};

measure("morph frame: circle to logo, 160 points", moving(shapes.circle, LOGO));
measure("morph frame: two-part logo, 160 points", moving(shapes.circle, RING_AND_DOT));
measure("sampleContours: logo", () => sampleContours(LOGO, 160));
measure("stepSpring x 1000", stepMany);
measure("springCss", () => springCss(springs.bouncy));
