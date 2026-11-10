export type Tick = (dt: number) => boolean | void;

const ticks = new Set<Tick>();
let raf = 0;
let last = 0;

function frame(now: number) {
  const dt = Math.min(Math.max(now - last, 0) / 1000, 0.1);
  last = now;
  for (const tick of ticks) {
    if (tick(dt) === false) ticks.delete(tick);
  }
  raf = ticks.size ? requestAnimationFrame(frame) : 0;
}

export function play(tick: Tick) {
  ticks.add(tick);
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  return () => {
    ticks.delete(tick);
  };
}
