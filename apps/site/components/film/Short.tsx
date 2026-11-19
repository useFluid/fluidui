"use client";

import { shapes } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";
import { brands } from "@usefluid/registry/brands.ts";
import { IslandToast } from "@usefluid/registry/island-toast/IslandToast.tsx";
import { Mascot } from "@usefluid/registry/mascot/Mascot.tsx";
import { MorphButton } from "@usefluid/registry/morph-button/MorphButton.tsx";
import { type Mood, Pet } from "@usefluid/registry/pet/Pet.tsx";
import { SegmentedPicker } from "@usefluid/registry/segmented-picker/SegmentedPicker.tsx";
import { SpringSwitch } from "@usefluid/registry/spring-switch/SpringSwitch.tsx";
import { TextReveal } from "@usefluid/registry/text-reveal/TextReveal.tsx";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { CHAIN, COMMAND, HOP, T, chainHop } from "./cues";
import s from "./Short.module.css";

const LOGO = brands[0].logo;
const INK = "#11100f";
const SKY = "#6fc4fd";
const LIME = "#d6f21a";
const HOT = "#ff5a1f";
const PAPER = "#f6f1e8";
const U = 3.6;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const out3 = (x: number) => 1 - (1 - x) ** 3;
const inOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const in2 = (x: number) => x * x;
const spring = (d: number, k = 9, w = 16) => (d <= 0 ? 0 : 1 - Math.exp(-k * d) * Math.cos(w * d));
const wobble = (d: number, amount = 0.13) => (d < 0 ? 0 : amount * Math.exp(-6 * d) * Math.cos(13 * d));
const smooth = (p: number) => p * p * p * (p * (6 * p - 15) + 10);

type Pose = { x: number; y: number; sx: number; sy: number; rot: number };
const rest = (x: number, y: number, since = -9, t = 0): Pose => {
  const w = wobble(t - since);
  return { x, y, sx: 1 + w * 0.8, sy: 1 - w, rot: 0 };
};

function walk(t: number, [t0, t1]: number[], x0: number, x1: number, y: number, height = 3.4): Pose {
  if (t <= t0) return rest(x0, y);
  if (t >= t1) return rest(x1, y, t1, t);
  const p = (t - t0) / (t1 - t0);
  const v = (30 * p * p * (1 - p) * (1 - p)) / 1.875;
  const phase = (t - t0) / HOP;
  const wave = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const squeeze = Math.cos(2 * Math.PI * phase) * 0.075 * Math.sqrt(v);
  const dir = Math.sign(x1 - x0);
  return {
    x: lerp(x0, x1, smooth(p)),
    y: y - wave * height * Math.sqrt(v),
    sx: 1 + squeeze,
    sy: 1 - squeeze,
    rot: dir * (9 * v + 3 * Math.sin(2 * Math.PI * phase) * v),
  };
}

function jump(t: number, [t0, t1]: number[], a: { x: number; y: number }, b: { x: number; y: number }, height = 16, crouchFor = 0.16): Pose {
  if (t < t0 - crouchFor) return rest(a.x, a.y);
  if (t < t0) {
    const crouch = Math.sin(Math.PI * 0.5 * prog(t, t0 - crouchFor, t0));
    return { x: a.x, y: a.y, sx: 1 + 0.14 * crouch, sy: 1 - 0.17 * crouch, rot: 0 };
  }
  if (t >= t1) return rest(b.x, b.y, t1, t);
  const p = smooth((t - t0) / (t1 - t0)) * 0.35 + ((t - t0) / (t1 - t0)) * 0.65;
  const stretch = Math.sin(Math.PI * p);
  return {
    x: lerp(a.x, b.x, p),
    y: lerp(a.y, b.y, p) - 4 * height * p * (1 - p),
    sx: 1 - 0.1 * stretch,
    sy: 1 + 0.14 * stretch,
    rot: Math.sign(b.x - a.x) * 12 * Math.sin(Math.PI * p),
  };
}

function Actor({
  pose,
  size,
  ground,
  shadow = true,
  z,
  children,
}: {
  pose: Pose;
  size: number;
  ground: number;
  shadow?: boolean;
  z?: number;
  children: ReactNode;
}) {
  const lift = Math.max(0, ground - pose.y);
  const near = 1 - Math.min(lift / 45, 0.75);
  return (
    <>
      {shadow && (
        <div
          className={s.shadow}
          style={{ left: `calc(50% + ${pose.x * U}px)`, top: `calc(50% + ${ground * U}px)`, width: size * U * 0.78 * near, opacity: 0.22 * near, zIndex: z }}
        />
      )}
      <div
        className={s.actor}
        style={{
          left: `calc(50% + ${pose.x * U}px)`,
          top: `calc(50% + ${pose.y * U}px)`,
          width: size * U,
          height: size * U,
          zIndex: z,
          transform: `translate(-50%, -100%) rotate(${pose.rot.toFixed(2)}deg) scale(${pose.sx.toFixed(4)}, ${pose.sy.toFixed(4)})`,
        }}
      >
        {children}
      </div>
    </>
  );
}

function Prop({ x, y, scale, children, z }: { x: number; y: number; scale: number; z?: number; children: ReactNode }) {
  return (
    <div
      className={s.prop}
      style={{
        left: `calc(50% + ${x * U}px)`,
        top: `calc(50% + ${y * U}px)`,
        zIndex: z,
        transform: `translate(-50%, -100%) scale(${Math.max(0, scale).toFixed(4)})`,
      }}
    >
      {children}
    </div>
  );
}

function useClock() {
  const [t, setT] = useState(-1);
  useEffect(() => {
    const at = Number(new URLSearchParams(window.location.search).get("at") ?? 0);
    const start = performance.now() - at * 1000;
    let id = 0;
    const tick = () => {
      setT((performance.now() - start) / 1000);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return t;
}

const VARS = {
  "--fluid-accent": INK,
  "--fluid-on-accent": PAPER,
  "--fluid-surface": "rgba(255,255,255,0.55)",
  "--fluid-surface-2": "rgba(255,255,255,0.3)",
  "--fluid-text": INK,
  "--fluid-text-2": "rgba(17,16,15,0.7)",
  "--fluid-border": "transparent",
  "--fluid-focus": INK,
  "--fluid-font": "var(--font-display), ui-sans-serif, sans-serif",
} as CSSProperties;

const OPTIONS = [
  { value: "calm", label: "Calm" },
  { value: "happy", label: "Happy" },
  { value: "wow", label: "Wow!" },
] as { value: "calm" | "happy" | "wow"; label: string }[];

export function Short() {
  const t = useClock();
  const [wide, setWide] = useState(false);
  useEffect(() => setWide(new URLSearchParams(window.location.search).get("format") === "wide"), []);
  if (t < 0) return <main className={s.short} />;

  const halfW = wide ? 88.9 : 50;
  const halfH = wide ? 50 : 88.9;
  const ground = wide ? 22 : 26;

  const SWITCH_TOP = ground - 12;
  const TRACK_X = 13;
  const PICKER_TOP = ground - 15;
  const BUTTON_TOP = ground - 17;
  const BUTTON_X = 14;
  const MUG_X = 16;

  let a: Pose;
  if (t < T.walkA[1] + 0.3) a = walk(t, T.walkA, -halfW - 16, -26, ground);
  else if (t < T.switchOut) a = jump(t, T.jumpA, { x: -26, y: ground }, { x: TRACK_X, y: SWITCH_TOP }, 18);
  else if (t < T.pickerIn + 0.45) a = jump(t, [T.switchOut + 0.05, T.pickerIn + 0.4], { x: TRACK_X, y: SWITCH_TOP }, { x: -15, y: PICKER_TOP }, 10);
  else if (t < T.pickerOut) a = walk(t, [T.pickerIn + 0.45, T.pickerIn + 0.45 + HOP * 3], -15, 15, PICKER_TOP, 4);
  else if (t < T.bump) a = jump(t, [T.pickerOut, T.pickerOut + 0.32], { x: 15, y: PICKER_TOP }, { x: -6, y: ground }, 8);
  else if (t < T.buttonDrop[1] + 0.2) {
    const push = out3(prog(t, T.bump, T.bump + 0.3));
    a = rest(-6 - 12 * push, ground, T.bump, t);
  } else if (t < T.hopOff[0]) a = jump(t, T.press, { x: -18, y: ground }, { x: 6, y: BUTTON_TOP }, 14);
  else a = jump(t, T.hopOff, { x: 6, y: BUTTON_TOP }, { x: -30, y: ground }, 10);

  const value = t < T.pick[0] ? "calm" : t < T.pick[1] ? "happy" : "wow";
  const moodA: Mood =
    t < T.walkA[1] + 0.15
      ? "idle"
      : t < T.jumpA[1]
        ? "curious"
        : t < T.pickerIn
          ? "happy"
          : t < T.pickerOut
            ? value === "calm"
              ? "idle"
              : value === "happy"
                ? "happy"
                : "surprised"
            : t < T.morph
              ? "surprised"
              : t < T.press[1]
                ? "curious"
                : "happy";
  const lookA =
    t < T.walkA[1]
      ? { x: 1, y: 0.2 }
      : t < T.walkA[1] + 0.5
        ? { x: 0, y: 0 }
        : t < T.bump
          ? { x: 0.7, y: 0.1 }
          : t < T.launch
            ? { x: 1, y: 0 }
            : t < T.buttonDrop[1]
              ? { x: 0.3, y: -1 }
              : { x: 0.5, y: -0.4 };

  const mugPose = t < T.morph ? walk(t, T.mugWalk, halfW + 18, MUG_X, ground, 6) : rest(MUG_X + 3 * out3(prog(t, T.bump, T.bump + 0.3)), ground, T.morph, t);
  const launchP = prog(t, T.launch, T.launch + 0.6);
  const mugY = mugPose.y - in2(launchP) * (halfH + ground + 50);
  const crouch = t > T.launch - 0.2 && t < T.launch ? Math.sin(Math.PI * prog(t, T.launch - 0.2, T.launch)) : 0;

  const switchScale = 1.7 * (spring(t - T.switchIn) - spring(t - T.switchOut, 14, 0));
  const pickerScale = 1.35 * (spring(t - T.pickerIn) - spring(t - T.pickerOut, 14, 0));
  const dropP = prog(t, T.buttonDrop[0], T.buttonDrop[1]);
  const buttonY = lerp(-halfH - 20, ground, in2(dropP));
  const buttonSquash = 1 - wobble(t - T.buttonDrop[1], 0.25) - wobble(t - T.press[1], 0.2);

  const lime = out3(prog(t, T.jumpA[1], T.jumpA[1] + 0.7));
  const ink = inOut(prog(t, T.expand, T.expand + 0.6));

  const punch = Math.sin(Math.PI * prog(t, T.bump, T.bump + 0.55)) * 0.04 + Math.sin(Math.PI * prog(t, T.press[1], T.press[1] + 0.5)) * 0.03;
  const lift = t > T.launch && t < T.buttonDrop[1] ? Math.sin(Math.PI * prog(t, T.launch, T.buttonDrop[1])) : 0;
  const cam = {
    x: 0,
    y: -lift * 10,
    scale: 1 + 0.06 * out3(prog(t, 0, 2.2)) - 0.06 * inOut(prog(t, 2.2, 3.3)) + punch,
    rx: -6 * lift,
    ry: lerp(-8, 0, out3(prog(t, 0, 2.4))),
  };

  const peek = out3(prog(t, T.peek, T.peek + 0.6));
  const merge = inOut(prog(t, T.merge, T.merge + 0.32));
  const textOut = inOut(prog(t, T.merge - 0.05, T.merge + 0.3));
  const TITLE_Y = wide ? -30 : -50;
  const TERM_Y = wide ? 7 : 2;
  const TOAST_Y = wide ? 32 : 33;
  const CREW = wide ? 16 : 22;
  const crew = [
    { color: SKY, x: wide ? -34 : -26, shapes: [undefined, shapes.drop, shapes.flower, shapes.circle] },
    { color: HOT, x: 0, shapes: [undefined, shapes.flower, shapes.pebble, shapes.drop] },
    { color: LIME, x: wide ? 34 : 26, shapes: [undefined, shapes.pebble, shapes.drop, shapes.flower] },
  ];
  const stations = (i: number) => [
    { x: [-7, 0, 7][i], y: TOAST_Y + 2.8 },
    { x: [-15, 0, 15][i], y: TERM_Y },
    { x: [-24, 0, 24][i], y: TITLE_Y + 1.5 },
  ];
  const PARADE = [
    shapes.circle,
    shapes.flower,
    LOGO,
    shapes.square,
    shapes.drop,
    brands[1].logo,
    shapes.triangle,
    brands[2].logo,
    shapes.pebble,
    brands[3].logo,
    shapes.capsule,
  ];
  const PARADE_COLORS = [SKY, HOT, LIME, PAPER];
  const beat = Math.floor((t - T.parade[0]) / HOP);
  const typed = COMMAND.slice(0, Math.round(prog(t, T.type[0], T.type[1]) * COMMAND.length));
  const logoD = t < T.logo ? shapes.dot : t < T.logo + 0.25 ? shapes.circle : LOGO;
  const endIn = (from: number) => out3(prog(t, from, from + 0.6));

  return (
    <main className={s.short} style={VARS} data-recording>
      <div className={s.bg} style={{ background: SKY }} />
      <div
        className={s.bg}
        style={{ background: LIME, clipPath: `circle(${lime * 160}% at calc(50% + ${TRACK_X * U}px) calc(50% + ${(ground - 6) * U}px))` }}
      />

      <div
        className={s.world}
        style={{ transform: `translate(${cam.x}px, ${cam.y * U}px) perspective(900px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) scale(${cam.scale})` }}
      >
        {t >= T.switchIn && t < T.switchOut + 0.4 && (
          <Prop x={0} y={ground} scale={switchScale} z={1}>
            <SpringSwitch label="Motion" checked={t >= T.jumpA[1]} onChange={() => {}} />
          </Prop>
        )}
        {t >= T.pickerIn && t < T.pickerOut + 0.4 && (
          <Prop x={0} y={ground} scale={pickerScale} z={1}>
            <SegmentedPicker label="Mood" value={value} onChange={() => {}} options={OPTIONS} />
          </Prop>
        )}
        {t >= T.mugWalk[0] && t < T.launch + 0.8 && (
          <>
            {launchP > 0 &&
              Array.from({ length: 9 }, (_, i) => {
                const back = prog(t - (i + 1) * 0.035, T.launch, T.launch + 0.6);
                const y = mugPose.y - in2(back) * (halfH + ground + 50) - 4;
                return (
                  <div
                    key={i}
                    className={s.spark}
                    style={{
                      left: `calc(50% + ${(MUG_X + 3 + Math.sin(i * 2.3) * 1.5) * U}px)`,
                      top: `calc(50% + ${y * U}px)`,
                      width: (9 - i) * 1.1 * U,
                      height: (9 - i) * 1.1 * U,
                      opacity: (1 - i / 9) * (back > 0 ? 1 : 0),
                    }}
                  />
                );
              })}
            <Actor
              pose={{ ...mugPose, y: mugY, sy: mugPose.sy * (1 - 0.22 * crouch + 0.25 * launchP), sx: mugPose.sx * (1 + 0.15 * crouch - 0.15 * launchP) }}
              size={26}
              ground={ground}
              z={2}
            >
              <Mascot
                object={t < T.morph ? "mug" : "rocket"}
                color={HOT}
                mood={t < T.bump ? "happy" : t < T.morph ? "surprised" : "happy"}
                look={t < T.bump ? { x: -1, y: 0 } : { x: -0.4, y: -0.8 }}
              />
            </Actor>
          </>
        )}
        {t >= T.buttonDrop[0] && t < T.expand + 0.7 && (
          <div
            className={s.prop}
            style={{
              left: `calc(50% + ${BUTTON_X * U}px)`,
              top: `calc(50% + ${buttonY * U}px)`,
              zIndex: 1,
              transform: `translate(-50%, -100%) scale(${1.3 * (2 - buttonSquash)}, ${1.3 * buttonSquash})`,
            }}
          >
            <MorphButton
              state={t < T.press[1] ? "idle" : t < T.done ? "loading" : "done"}
              labels={{ idle: "Make it move", loading: "Moving", done: "In motion" }}
              tabIndex={-1}
            />
          </div>
        )}
        {t < T.expand + 0.7 && (
          <Actor pose={a} size={24} ground={ground} z={3}>
            <Pet color={INK} mood={moodA} look={lookA} />
          </Actor>
        )}
      </div>

      {ink > 0 && (
        <div
          className={s.bg}
          style={{ background: INK, clipPath: `circle(${ink * 150}% at calc(50% + ${BUTTON_X * U}px) calc(50% + ${(ground - 9) * U}px))` }}
        />
      )}

      {t >= T.expand && t < T.merge + 0.4 && (
        <div className={s.layer} style={{ opacity: 1 - textOut, transform: `translateY(${-textOut * 12 * U}px)` }}>
          <h1 className={s.title} style={{ top: `calc(50% + ${TITLE_Y * U}px)`, fontSize: wide ? 40 : undefined }}>
            <span>
              <TextReveal text="Your brand," play={t >= T.lines[0]} stagger={30} />
            </span>
            <span className={s.serif}>
              <TextReveal text="in motion." play={t >= T.lines[1]} stagger={36} />
            </span>
          </h1>
          {t >= T.type[0] - 0.15 && (
            <div className={s.term} style={{ top: `calc(50% + ${TERM_Y * U}px)`, opacity: endIn(T.type[0] - 0.15) }}>
              <span className={s.dollar}>$</span> {typed}
              <i className={s.caret} style={{ opacity: Math.floor(t * 3) % 2 === 0 || t < T.type[1] ? 1 : 0 }} />
            </div>
          )}
          <div className={s.toast} style={{ top: `calc(50% + ${TOAST_Y * U}px)` }}>
            <IslandToast message={t >= T.toast ? "7 skills installed" : null} />
          </div>
        </div>
      )}

      {t >= T.parade[0] &&
        t < T.parade[1] + 0.2 &&
        PARADE.slice(0, 10).map((_, i) => {
          const spacing = 15;
          const travel = (halfW * 2 + 24 + 9 * spacing) / (T.parade[1] - T.parade[0]);
          const x = halfW + 12 + i * spacing - travel * (t - T.parade[0]);
          if (x < -halfW - 12 || x > halfW + 12) return null;
          const d = PARADE[(i + Math.max(0, beat)) % PARADE.length];
          const bob = Math.sin((t - T.parade[0]) * 7 + i) * 2;
          return (
            <svg
              key={i}
              viewBox="0 0 120 120"
              className={s.parade}
              style={{
                left: `calc(50% + ${x * U}px)`,
                top: `calc(50% + ${(-2 + bob) * U}px)`,
                width: 11 * U,
                height: 11 * U,
                transform: `translate(-50%, -50%) rotate(${(t * 90 + i * 40) % 360}deg)`,
              }}
              aria-hidden
            >
              <MorphPath d={d} fill={PARADE_COLORS[i % PARADE_COLORS.length]} />
            </svg>
          );
        })}

      {t >= T.peek &&
        t < T.logo + 0.3 &&
        crew.map((c, i) => {
          const start = { x: c.x, y: wide ? halfH + 20 : halfH + 14 - peek * 12 };
          const st = stations(i);
          let k = 0;
          while (k < CHAIN.stations - 1 && t >= chainHop(i, k)[1]) k++;
          const landed = [0, 1, 2].filter((j) => t >= chainHop(i, j)[1]).length;
          let pose = jump(t, chainHop(i, k), k === 0 ? start : st[k - 1], st[k], k === 0 ? 16 : 10, k === 0 ? 0.16 : CHAIN.gap);
          if (merge > 0) {
            const top = st[CHAIN.stations - 1];
            pose = {
              x: lerp(top.x, 0, merge),
              y: lerp(top.y, 4, merge) - Math.sin(Math.PI * merge) * 12,
              sx: 1 - merge,
              sy: 1 - merge,
              rot: merge * (i - 1) * 120,
            };
          }
          const next = st[Math.min(landed, CHAIN.stations - 1)];
          return (
            <Actor key={c.color} pose={pose} size={CREW} ground={ground} shadow={false} z={4}>
              <Pet
                color={c.color}
                shape={c.shapes[landed]}
                drop={landed === 0}
                mood={landed === 0 ? "curious" : "happy"}
                look={{ x: clamp((next.x - pose.x) / 20, -1, 1), y: landed === 0 ? -1 : -0.3 }}
              />
            </Actor>
          );
        })}

      {t >= T.merge && (
        <div className={s.end}>
          <svg viewBox="0 0 120 120" className={s.logo} style={{ transform: `scale(${spring(t - T.merge, 8, 12).toFixed(4)})` }} aria-hidden>
            <MorphPath d={logoD} fill={SKY} />
          </svg>
          <p className={s.word}>
            <TextReveal text="Fluid" play={t >= T.word} stagger={55} />
          </p>
          <p className={s.sub} style={{ opacity: endIn(T.url), transform: `translateY(${(1 - endIn(T.url)) * 3 * U}px)` }}>
            Open-source motion for React
          </p>
          <p className={s.url} style={{ opacity: endIn(T.url + 0.3) }}>
            fluidui.willradoux.com
          </p>
        </div>
      )}
    </main>
  );
}
