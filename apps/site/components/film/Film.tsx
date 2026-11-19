"use client";

import { shapes } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";
import { brands } from "@usefluid/registry/brands.ts";
import { DemoProvider } from "@usefluid/registry/demo-context.tsx";
import { demos } from "@usefluid/registry/demos.tsx";
import { Mascot } from "@usefluid/registry/mascot/Mascot.tsx";
import { type Mood, Pet } from "@usefluid/registry/pet/Pet.tsx";
import { TextReveal } from "@usefluid/registry/text-reveal/TextReveal.tsx";
import { type CSSProperties, type ReactNode, memo, useEffect, useMemo, useState } from "react";
import { type Paint, paintVars } from "../Mosaic";
import s from "./Film.module.css";

const LOGO = brands[0].logo;
const SKY = "#6fc4fd";

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = {
  out: (x: number) => 1 - (1 - x) ** 3,
  inOut: (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
  expo: (x: number) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
};

function kf(t: number, frames: [number, number][], curve = ease.inOut) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1] = frames[i];
    const [t0, v0] = frames[i - 1];
    if (t <= t1) return v0 + (v1 - v0) * curve((t - t0) / (t1 - t0));
  }
  return frames[frames.length - 1][1];
}

const step = <T,>(t: number, list: [number, T][]) => list.reduce((value, [at, v]) => (t >= at ? v : value), list[0][1]);

const SCENES = [
  { from: 0, to: 6, label: "" },
  { from: 6, to: 11, label: "" },
  { from: 11, to: 19.5, label: "01  Metamorph" },
  { from: 19.5, to: 24, label: "01  Metamorph" },
  { from: 24, to: 29, label: "02  Characters" },
  { from: 29, to: 35, label: "02  Characters" },
  { from: 35, to: 41.5, label: "03  Controls" },
  { from: 41.5, to: 46, label: "04  Your brand" },
  { from: 46, to: 50, label: "04  Your brand" },
  { from: 50, to: 55.5, label: "05  Agent skills" },
  { from: 55.5, to: 62, label: "" },
];
const LENGTH = 62;

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

function Scene({ t, index, children, fade = 0.55 }: { t: number; index: number; fade?: number; children: (local: number) => ReactNode }) {
  const { from, to } = SCENES[index];
  if (t < from - 0.02 || t > to + fade) return null;
  const enter = index === 0 ? 1 : ease.out(prog(t, from, from + fade));
  const exit = index === SCENES.length - 1 ? 0 : ease.inOut(prog(t, to, to + fade));
  const blur = (1 - enter) * 16 + exit * 22;
  const style: CSSProperties = {
    opacity: enter * (1 - exit),
    filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined,
    transform: `scale(${(1 + (1 - enter) * 0.07 - exit * 0.05).toFixed(4)})`,
  };
  return (
    <div className={s.scene} style={style}>
      {children(Math.max(0, t - from))}
    </div>
  );
}

function Camera({
  rx = 0,
  ry = 0,
  rz = 0,
  x = 0,
  y = 0,
  z = 0,
  perspective = 1500,
  children,
}: {
  rx?: number;
  ry?: number;
  rz?: number;
  x?: number;
  y?: number;
  z?: number;
  perspective?: number;
  children: ReactNode;
}) {
  return (
    <div className={s.camera} style={{ perspective }}>
      <div className={s.rig} style={{ transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
        {children}
      </div>
    </div>
  );
}

const Card = memo(function Card({
  slug,
  paint = "accent",
  brand = "fluid",
  className,
  style,
}: {
  slug: string;
  paint?: Paint;
  brand?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const b = brands.find((x) => x.id === brand) ?? brands[0];
  const vars = { ...b.vars, ...paintVars(paint, b) } as CSSProperties;
  const Demo = demos[slug];
  return (
    <div className={`${s.card} ${className ?? ""}`} style={{ ...vars, ...style }}>
      <DemoProvider value={{ name: b.name, logo: b.logo, play: true, auto: true }}>
        <Demo />
      </DemoProvider>
    </div>
  );
});

function Label({ local, n, title, sub }: { local: number; n: string; title: string; sub?: string }) {
  const a = ease.out(prog(local, 0.15, 0.9));
  return (
    <div className={s.label} style={{ opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
      <span className={s.index}>{n}</span>
      <h2 className={s.labelTitle}>
        <TextReveal text={title} play={local > 0.15} stagger={22} />
      </h2>
      {sub && (
        <p className={s.labelSub} style={{ opacity: ease.out(prog(local, 0.6, 1.4)) }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Opening({ local }: { local: number }) {
  const d = step(local, [
    [0, shapes.dot],
    [0.35, shapes.circle],
    [1.1, shapes.pebble],
    [1.8, shapes.flower],
    [2.5, shapes.square],
    [3.2, LOGO],
  ] as [number, string][]);
  const glow = 0.4 + 0.6 * ease.out(prog(local, 3.2, 4));
  return (
    <Camera
      rx={kf(local, [
        [0, 22],
        [4.2, 0],
      ])}
      rz={kf(local, [
        [0, -8],
        [4.2, 0],
      ])}
      z={kf(
        local,
        [
          [0, -420],
          [5.5, 40],
        ],
        ease.out,
      )}
    >
      <div className={s.center}>
        <svg viewBox="0 0 120 120" className={s.heroMark} style={{ filter: `drop-shadow(0 0 ${40 * glow}px rgba(111,196,253,${0.55 * glow}))` }} aria-hidden>
          <MorphPath d={d} fill={SKY} />
        </svg>
        <p className={s.wordmark}>
          <TextReveal text="Fluid" play={local > 3.5} stagger={60} />
        </p>
      </div>
    </Camera>
  );
}

function Tagline({ local }: { local: number }) {
  const spin = local * 14;
  return (
    <Camera
      ry={kf(local, [
        [0, -14],
        [5, 10],
      ])}
      rx={kf(local, [
        [0, 6],
        [5, -4],
      ])}
      z={kf(
        local,
        [
          [0, -60],
          [5, 140],
        ],
        (x) => x,
      )}
    >
      <svg viewBox="0 0 120 120" className={s.ghost} style={{ transform: `translate(-62%, -40%) rotate(${spin}deg)` }} aria-hidden>
        <MorphPath d={local > 2 ? shapes.flower : shapes.triangle} fill="none" stroke={SKY} strokeWidth={0.4} />
      </svg>
      <svg viewBox="0 0 120 120" className={s.ghost} style={{ transform: `translate(30%, -70%) rotate(${-spin}deg) scale(0.6)` }} aria-hidden>
        <MorphPath d={local > 2.6 ? shapes.capsule : shapes.circle} fill="none" stroke="#ffffff" strokeWidth={0.5} />
      </svg>
      <div className={s.center}>
        <h1 className={s.tag}>
          <span>
            <TextReveal text="Your brand," play={local > 0.25} stagger={34} />
          </span>
          <span className={s.serif}>
            <TextReveal text="in motion." play={local > 1.05} stagger={40} />
          </span>
        </h1>
        <p className={s.lede} style={{ opacity: ease.out(prog(local, 2.1, 3)), transform: `translateY(${(1 - ease.out(prog(local, 2.1, 3))) * 14}px)` }}>
          Open-source motion for React. Outlines that flow on real springs.
        </p>
      </div>
    </Camera>
  );
}

const GRID: { slug: string; paint: Paint }[] = [
  { slug: "shape-morph", paint: "accent" },
  { slug: "icon-morph", paint: "ink" },
  { slug: "menu-morph", paint: "lime" },
  { slug: "morph-button", paint: "paper" },
  { slug: "copy-morph", paint: "hot" },
  { slug: "morph-loader", paint: "sky" },
];

function Metamorph({ local }: { local: number }) {
  return (
    <>
      <Camera
        rx={kf(local, [
          [0, 58],
          [4.5, 34],
          [8.5, 10],
        ])}
        rz={kf(local, [
          [0, -30],
          [8.5, -5],
        ])}
        z={kf(
          local,
          [
            [0, -520],
            [8.5, 30],
          ],
          ease.out,
        )}
        x={kf(local, [
          [0, 220],
          [8.5, -40],
        ])}
        y={kf(local, [
          [0, 60],
          [8.5, 10],
        ])}
      >
        <div className={s.grid}>
          {GRID.map((g, i) => (
            <div
              key={g.slug}
              className={s.rise}
              style={{
                transform: `translateZ(${(1 - ease.out(prog(local, 0.1 + i * 0.12, 1.1 + i * 0.12))) * -260}px)`,
                opacity: ease.out(prog(local, 0.1 + i * 0.12, 0.8 + i * 0.12)),
              }}
            >
              <Card slug={g.slug} paint={g.paint} className={s.gridCard} />
            </div>
          ))}
        </div>
      </Camera>
      <Label local={local} n="01" title="Metamorph" sub="Any shape flows into any shape. Even your logo." />
    </>
  );
}

function DialogShot({ local }: { local: number }) {
  return (
    <>
      <Camera
        ry={kf(local, [
          [0, -26],
          [4.5, 16],
        ])}
        rx={kf(local, [
          [0, 10],
          [4.5, 4],
        ])}
        z={kf(local, [
          [0, -120],
          [4.5, 60],
        ])}
      >
        <Card slug="morph-dialog" paint="sky" className={s.wide} />
      </Camera>
      <Caption local={local} text="Windows grow out of the card that opened them." />
    </>
  );
}

function Caption({ local, text }: { local: number; text: string }) {
  const a = ease.out(prog(local, 0.4, 1.2));
  return (
    <p className={s.caption} style={{ opacity: a, transform: `translateY(${(1 - a) * 12}px)` }}>
      {text}
    </p>
  );
}

const PETS = [SKY, "#ff5a1f", "#d6f21a", "#3262fb", "#f6f1ea", "#0e7c66", "#e4572e"];
const MOODS: Mood[] = ["happy", "curious", "surprised", "idle", "sleepy"];

function Pets({ local }: { local: number }) {
  const dot = { x: Math.sin(local * 1.4) * 0.9, y: Math.cos(local * 2.1) * 0.5 };
  return (
    <>
      <Camera
        rx={kf(local, [
          [0, 24],
          [5, 8],
        ])}
        ry={kf(local, [
          [0, -12],
          [5, 12],
        ])}
        z={kf(local, [
          [0, -200],
          [5, 80],
        ])}
      >
        <div className={s.pets}>
          {PETS.map((color, i) => {
            const enter = ease.out(prog(local, 0.1 + i * 0.09, 0.9 + i * 0.09));
            const bob = Math.sin(local * 3 + i * 0.9) * 10;
            const mood = MOODS[Math.floor(local * 0.9 + i * 0.7) % MOODS.length];
            return (
              <div key={color} className={s.pet} style={{ transform: `translateY(${(1 - enter) * 160 + bob}px) scale(${0.6 + 0.4 * enter})`, opacity: enter }}>
                <Pet color={color} mood={mood} look={{ x: dot.x - (i - 3) * 0.18, y: dot.y }} />
              </div>
            );
          })}
        </div>
        <div className={s.firefly} style={{ transform: `translate(${dot.x * 520}px, ${dot.y * 120 - 180}px)` }} />
      </Camera>
      <Label local={local} n="02" title="Characters" sub="Pets that react to your product, in your colours." />
    </>
  );
}

const OBJECTS = ["mug", "rocket", "pizza", "plant", "controller", "camera", "heart", "cat", "sun", "laptop"];
const OBJECT_COLORS = [SKY, "#ff5a1f", "#d6f21a", "#3262fb", "#e4572e", "#0e7c66"];

function BotMascot({ local }: { local: number }) {
  const n = Math.floor(local / 0.62);
  const object = OBJECTS[n % OBJECTS.length];
  const color = OBJECT_COLORS[n % OBJECT_COLORS.length];
  return (
    <>
      <Camera
        rx={6}
        ry={kf(local, [
          [0, 10],
          [6, -8],
        ])}
        z={kf(local, [
          [0, -140],
          [6, 40],
        ])}
      >
        <div className={s.pair}>
          <div style={{ transform: `rotateY(24deg) translateZ(-40px)` }}>
            <Card slug="bot" paint="paper" className={s.botCard} />
          </div>
          <div className={s.mascotStage} style={{ transform: `rotateY(-22deg)` }}>
            <div className={s.mascot}>
              <Mascot object={object} color={color} mood={n % 3 === 0 ? "happy" : "curious"} look={{ x: Math.sin(local * 2) * 0.6, y: 0.1 }} />
            </div>
            <p className={s.mascotName}>{object}</p>
          </div>
        </div>
      </Camera>
      <Caption local={local} text="Bots that listen, think and answer. Mascots from one sentence." />
    </>
  );
}

const RING: { slug: string; paint: Paint }[] = [
  { slug: "segmented-picker", paint: "accent" },
  { slug: "pill-tabs", paint: "lime" },
  { slug: "spring-switch", paint: "ink" },
  { slug: "spring-button", paint: "hot" },
  { slug: "morph-island", paint: "paper" },
  { slug: "island-toast", paint: "sky" },
];

function Controls({ local }: { local: number }) {
  const turn = kf(
    local,
    [
      [0, 40],
      [6.5, -250],
    ],
    (x) => ease.inOut(x),
  );
  const gap = 360 / RING.length;
  return (
    <>
      <Camera
        rx={kf(local, [
          [0, -16],
          [6.5, -6],
        ])}
        z={kf(
          local,
          [
            [0, -820],
            [1.4, -420],
            [6.5, -360],
          ],
          ease.out,
        )}
        y={30}
      >
        <div className={s.ring} style={{ transform: `rotateY(${turn}deg)` }}>
          {RING.map((r, i) => (
            <div key={r.slug} className={s.ringItem} style={{ transform: `rotateY(${i * gap}deg) translateZ(440px)` }}>
              <Card slug={r.slug} paint={r.paint} className={s.ringCard} />
            </div>
          ))}
        </div>
      </Camera>
      <Label local={local} n="03" title="Controls" sub="Pickers, tabs, switches and buttons on real springs." />
    </>
  );
}

const BRANDS = ["fluid", "orbe", "cais", "vento"];

function Brands({ local }: { local: number }) {
  return (
    <>
      <Camera
        rx={kf(local, [
          [0, 18],
          [4.5, 4],
        ])}
        ry={kf(local, [
          [0, 12],
          [4.5, -6],
        ])}
        z={kf(local, [
          [0, -260],
          [4.5, 40],
        ])}
      >
        <div className={s.brands}>
          {BRANDS.map((id, i) => {
            const b = brands.find((x) => x.id === id)!;
            const a = ease.out(prog(local, 0.15 + i * 0.14, 1 + i * 0.14));
            return (
              <figure key={id} className={s.brand} style={{ opacity: a, transform: `translateY(${(1 - a) * 80}px) rotateX(${(1 - a) * -40}deg)` }}>
                <Card slug="shape-morph" brand={id} paint={id === "cais" ? "ink" : id === "vento" ? "paper" : "accent"} className={s.brandCard} />
                <figcaption style={{ fontFamily: b.vars["--fluid-font"] }}>{b.name}</figcaption>
              </figure>
            );
          })}
        </div>
      </Camera>
      <Label local={local} n="04" title="Your brand" sub="Ten CSS variables. Your logo, colours and font." />
    </>
  );
}

function Splash({ local }: { local: number }) {
  return (
    <Camera
      z={kf(
        local,
        [
          [0, 120],
          [4, 0],
        ],
        ease.out,
      )}
      rx={kf(local, [
        [0, 6],
        [4, 0],
      ])}
    >
      <Card slug="splash-dots" paint="sky" className={s.full} />
    </Camera>
  );
}

const SKILLS = ["fluid-brand", "fluid-components", "fluid-metamorph", "fluid-splash", "fluid-characters", "fluid-video", "fluid-ai-video"];
const AGENTS = ["Claude Code", "Codex", "Cursor", "Gemini CLI"];
const COMMAND = "npx skills@latest add useFluid/fluidui";

function Skills({ local }: { local: number }) {
  const typed = COMMAND.slice(0, Math.floor(prog(local, 0.4, 1.9) * COMMAND.length));
  const caret = Math.floor(local * 2.4) % 2 === 0;
  return (
    <>
      <Camera
        ry={kf(local, [
          [0, 22],
          [5.5, 4],
        ])}
        rx={kf(local, [
          [0, 8],
          [5.5, 2],
        ])}
        z={kf(local, [
          [0, -160],
          [5.5, 30],
        ])}
        x={-40}
      >
        <div className={s.skills}>
          <div className={s.terminal}>
            <div className={s.dots}>
              <i />
              <i />
              <i />
            </div>
            <p className={s.cmd}>
              <span className={s.prompt}>$</span> {typed}
              <span className={s.caret} style={{ opacity: caret || local < 1.9 ? 1 : 0 }} />
            </p>
            {SKILLS.map((name, i) => {
              const a = ease.out(prog(local, 2.1 + i * 0.16, 2.5 + i * 0.16));
              return (
                <p key={name} className={s.line} style={{ opacity: a, transform: `translateX(${(1 - a) * -16}px)` }}>
                  <span className={s.tick}>✓</span> {name}
                </p>
              );
            })}
          </div>
          <div className={s.pitch}>
            <h2 className={s.pitchTitle}>
              <TextReveal text="Teach your agent" play={local > 0.6} stagger={26} />
              <br />
              <span className={s.serif}>
                <TextReveal text="to move like your brand." play={local > 1.2} stagger={26} />
              </span>
            </h2>
            <div className={s.agents}>
              {AGENTS.map((agent, i) => {
                const a = ease.out(prog(local, 3 + i * 0.14, 3.6 + i * 0.14));
                return (
                  <span key={agent} className={s.agent} style={{ opacity: a, transform: `translateY(${(1 - a) * 14}px) scale(${0.9 + a * 0.1})` }}>
                    {agent}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Camera>
      <Label local={local} n="05" title="Agent skills" />
    </>
  );
}

function End({ local }: { local: number }) {
  const d = step(local, [
    [0, shapes.dot],
    [0.3, shapes.drop],
    [0.9, LOGO],
  ] as [number, string][]);
  const a = (from: number) => ease.out(prog(local, from, from + 0.8));
  return (
    <Camera
      rx={kf(local, [
        [0, -10],
        [3, 0],
      ])}
      z={kf(
        local,
        [
          [0, -200],
          [6, 30],
        ],
        ease.out,
      )}
    >
      <div className={s.center}>
        <svg viewBox="0 0 120 120" className={s.endMark} aria-hidden>
          <MorphPath d={d} fill={SKY} />
        </svg>
        <p className={s.endWord}>
          <TextReveal text="Fluid" play={local > 1} stagger={50} />
        </p>
        <p className={s.endLine} style={{ opacity: a(1.7), transform: `translateY(${(1 - a(1.7)) * 12}px)` }}>
          Open-source motion for React
        </p>
        <div className={s.endRow} style={{ opacity: a(2.3), transform: `translateY(${(1 - a(2.3)) * 12}px)` }}>
          <code className={s.pill}>npm i @usefluid/motion</code>
        </div>
        <p className={s.url} style={{ opacity: a(2.9) }}>
          fluidui.willradoux.com · github.com/useFluid/fluidui
        </p>
      </div>
    </Camera>
  );
}

function useGrain() {
  return useMemo(() => {
    if (typeof document === "undefined") return "";
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const img = g.createImageData(256, 256);
    let seed = 7;
    for (let i = 0; i < img.data.length; i += 4) {
      seed = (seed * 16807) % 2147483647;
      const v = seed % 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL();
  }, []);
}

function Timecode({ t }: { t: number }) {
  const frames = Math.floor((t % 1) * 24);
  const sec = Math.floor(t);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span>
      00:{pad(Math.floor(sec / 60))}:{pad(sec % 60)}:{pad(frames)}
    </span>
  );
}

export function Film() {
  const t = useClock();
  const grain = useGrain();
  if (t < 0) return <main className={s.film} />;
  const current = SCENES.findLast((x) => t >= x.from) ?? SCENES[0];
  const flash = Math.max(0, ...SCENES.slice(1).map((x) => 1 - Math.abs(t - x.from - 0.2) / 0.45));
  const frame = Math.floor(t * 24);
  const blobs = {
    a: `${50 + Math.sin(t * 0.3) * 30}% ${40 + Math.cos(t * 0.25) * 25}%`,
    b: `${50 + Math.cos(t * 0.21) * 35}% ${60 + Math.sin(t * 0.33) * 25}%`,
  };
  return (
    <main className={s.film} data-recording>
      <div
        className={s.backdrop}
        style={{
          background: `radial-gradient(40% 50% at ${blobs.a}, rgba(111,196,253,0.20), transparent 70%), radial-gradient(35% 45% at ${blobs.b}, rgba(255,90,31,0.10), transparent 70%), #07080a`,
        }}
      />
      <Scene t={t} index={0}>
        {(l) => <Opening local={l} />}
      </Scene>
      <Scene t={t} index={1}>
        {(l) => <Tagline local={l} />}
      </Scene>
      <Scene t={t} index={2}>
        {(l) => <Metamorph local={l} />}
      </Scene>
      <Scene t={t} index={3}>
        {(l) => <DialogShot local={l} />}
      </Scene>
      <Scene t={t} index={4}>
        {(l) => <Pets local={l} />}
      </Scene>
      <Scene t={t} index={5}>
        {(l) => <BotMascot local={l} />}
      </Scene>
      <Scene t={t} index={6}>
        {(l) => <Controls local={l} />}
      </Scene>
      <Scene t={t} index={7}>
        {(l) => <Brands local={l} />}
      </Scene>
      <Scene t={t} index={8}>
        {(l) => <Splash local={l} />}
      </Scene>
      <Scene t={t} index={9}>
        {(l) => <Skills local={l} />}
      </Scene>
      <Scene t={t} index={10}>
        {(l) => <End local={l} />}
      </Scene>
      <div className={s.flash} style={{ opacity: flash * 0.5 }} />
      <div className={s.vignette} />
      <div className={s.grain} style={{ backgroundImage: `url(${grain})`, backgroundPosition: `${(frame * 73) % 256}px ${(frame * 151) % 256}px` }} />
      <div className={s.hud}>
        <span className={s.hudBrand}>
          <svg viewBox="0 0 120 120" aria-hidden>
            <path d={LOGO} fill="currentColor" />
          </svg>
          Fluid
        </span>
        <span>Open source · MIT</span>
        <span className={s.hudLabel}>{current.label}</span>
        <span className={s.hudTime}>
          <Timecode t={t} />
          <i className={s.bar}>
            <b style={{ width: `${clamp(t / LENGTH) * 100}%` }} />
          </i>
        </span>
      </div>
    </main>
  );
}
