export const HOP = 0.34;

export const T = {
  walkA: [0.3, 2.0],
  switchIn: 2.3,
  jumpA: [2.78, 3.3],
  switchOut: 3.95,
  pickerIn: 4.05,
  pick: [4.6, 5.2],
  mugWalk: [5.0, 6.36],
  pickerOut: 5.85,
  bump: 6.36,
  morph: 6.75,
  launch: 7.15,
  buttonDrop: [7.75, 8.1],
  press: [8.38, 8.74],
  hopOff: [9.0, 9.34],
  done: 9.55,
  expand: 10.05,
  lines: [10.35, 10.85],
  parade: [10.45, 12.0],
  peek: 10.9,
  type: [12.0, 12.95],
  toast: 13.15,
  merge: 15.5,
  logo: 15.7,
  word: 16.0,
  url: 16.45,
  end: 18,
};

export const CHAIN = { start: 13.4, hop: 0.32, gap: 0.06, stagger: 0.38, stations: 3 };

export const chainHop = (pet: number, station: number) => {
  const t0 = CHAIN.start + pet * CHAIN.stagger + station * (CHAIN.hop + CHAIN.gap);
  return [t0, t0 + CHAIN.hop];
};

export const COMMAND = "npx skills add useFluid/fluidui";

export type Sound =
  | "drip"
  | "note"
  | "step"
  | "pop"
  | "click"
  | "boing"
  | "tick"
  | "bonk"
  | "shimmer"
  | "whoosh"
  | "thud"
  | "press"
  | "ding"
  | "chord"
  | "key"
  | "rise"
  | "swish";

const steps = (from: number, to: number) => {
  const out: number[] = [];
  for (let t = from + HOP; t <= to + 0.001; t += HOP) out.push(Number(t.toFixed(3)));
  return out;
};

export const CUES: { t: number; sound: Sound; gain?: number; pitch?: number }[] = [
  ...steps(T.walkA[0], T.walkA[1]).map((t, i) => ({ t, sound: "drip" as Sound, pitch: i })),
  { t: T.switchIn, sound: "pop" },
  { t: T.jumpA[0] - 0.02, sound: "swish", gain: 0.5 },
  { t: T.jumpA[1], sound: "click" },
  { t: T.jumpA[1] + 0.03, sound: "boing" },
  { t: T.switchOut, sound: "pop", gain: 0.5 },
  { t: T.pickerIn, sound: "pop" },
  { t: T.pick[0], sound: "tick" },
  { t: T.pick[1], sound: "tick" },
  ...steps(T.mugWalk[0], T.mugWalk[1] - 0.2).map((t, i) => ({ t, sound: "drip" as Sound, gain: 0.8, pitch: i + 3 })),
  { t: T.pickerOut, sound: "pop", gain: 0.5 },
  { t: T.bump, sound: "bonk" },
  { t: T.morph, sound: "shimmer" },
  { t: T.launch, sound: "whoosh" },
  { t: T.buttonDrop[1], sound: "thud" },
  { t: T.press[0] - 0.02, sound: "swish", gain: 0.5 },
  { t: T.press[1], sound: "press" },
  { t: T.hopOff[1], sound: "drip", pitch: 2 },
  { t: T.done, sound: "ding" },
  { t: T.expand, sound: "whoosh", gain: 0.8 },
  { t: T.peek, sound: "rise", gain: 0.6 },
  { t: T.parade[0] + 0.1, sound: "whoosh", gain: 0.45 },
  ...Array.from({ length: Math.floor((T.parade[1] - T.parade[0]) / HOP) }, (_, i) => ({
    t: Number((T.parade[0] + (i + 1) * HOP).toFixed(3)),
    sound: "tick" as Sound,
    gain: 0.35,
  })),
  ...Array.from(COMMAND, (_, i) => ({ t: Number((T.type[0] + (i * (T.type[1] - T.type[0])) / COMMAND.length).toFixed(3)), sound: "key" as Sound, gain: 0.5 })),
  { t: T.toast, sound: "pop" },
  { t: T.toast + 0.12, sound: "ding", gain: 0.6 },
  ...[0, 1, 2].flatMap((pet) => [0, 1, 2].map((station) => ({ t: chainHop(pet, station)[1], sound: "note" as Sound, pitch: station, gain: 1 - pet * 0.15 }))),
  ...[0, 1, 2].map((pet) => ({ t: chainHop(pet, 0)[0] - 0.02, sound: "swish" as Sound, gain: 0.35 })),
  { t: T.merge, sound: "whoosh", gain: 0.6 },
  { t: T.logo, sound: "chord" },
];
