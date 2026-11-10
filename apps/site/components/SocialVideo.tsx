"use client";

import { MorphPath, useReducedMotion } from "@usefluid/motion/react";
import { useEffect, useRef, useState } from "react";
import { MARK } from "@/lib/logo";
import { useLang } from "./LangProvider";
import styles from "./SocialVideo.module.css";

const HEART = [12, 21, 12, 21, 4.5, 16.4, 2.4, 11.9, 1, 8.6, 3, 5, 6.6, 5, 8.7, 5, 10.2, 6.2, 12, 8.2, 13.8, 6.2, 15.3, 5, 17.4, 5, 21, 5, 23, 8.6, 21.6, 11.9, 19.5, 16.4, 12, 21, 12, 21];

function heart(k = 1, cx = 12, cy = 12.4) {
  const p = HEART.map((v, i) => (i % 2 ? cy + (v - cy) * k : cx + (v - cx) * k).toFixed(2));
  let d = `M${p[0]} ${p[1]}`;
  for (let i = 2; i < p.length; i += 6) d += `C${p[i]} ${p[i + 1]} ${p[i + 2]} ${p[i + 3]} ${p[i + 4]} ${p[i + 5]}`;
  return `${d}Z`;
}

const FULL = heart();
const OUTLINE = `${heart()}${heart(0.74)}`;
const LIKE_SPRING = { w: 20, z: 0.62, points: 64 };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONS = {
  comment: <path {...stroke} d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.5Z" />,
  share: <path {...stroke} d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />,
  close: <path {...stroke} d="M6 6l12 12M18 6 6 18" />,
  more: <g fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></g>,
};

function Icon({ name, size = 24 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      {ICONS[name]}
    </svg>
  );
}

function Avatar({ size }: { size: number }) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="-4 12 128 96" width={size * 0.64} height={size * 0.48}>
        <path d={MARK} fill="currentColor" />
      </svg>
    </span>
  );
}

function Like({ liked, onToggle, size = 26 }: { liked: boolean; onToggle(): void; size?: number }) {
  const { t } = useLang();
  return (
    <button type="button" className={styles.icon} data-liked={liked ? "" : undefined} aria-pressed={liked} aria-label={liked ? t.videos.unlike : t.videos.like} onClick={onToggle}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
        <MorphPath d={liked ? FULL : OUTLINE} config={LIKE_SPRING} fill="currentColor" />
      </svg>
    </button>
  );
}

function useVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return { ref, reduced };
}

function useDoubleTap(like: () => void) {
  const [burst, setBurst] = useState(0);
  const last = useRef(0);
  const onPointerUp = () => {
    const now = performance.now();
    if (now - last.current < 320) {
      like();
      setBurst((b) => b + 1);
      last.current = 0;
    } else last.current = now;
  };
  return { burst, onPointerUp };
}

function Burst({ n }: { n: number }) {
  const [d, setD] = useState(heart(0.05));
  useEffect(() => {
    if (!n) return;
    setD(heart(1));
    const t = setTimeout(() => setD(heart(0.05)), 700);
    return () => clearTimeout(t);
  }, [n]);
  if (!n) return null;
  return (
    <svg key={n} className={styles.burst} viewBox="0 0 24 24" aria-hidden>
      <MorphPath d={d} config={{ w: 16, z: 0.6, points: 64 }} fill="#ffffff" />
    </svg>
  );
}

export function StoryVideo({ src, label }: { src: string; label: string }) {
  const { t } = useLang();
  const { ref, reduced } = useVideo();
  const bar = useRef<HTMLSpanElement>(null);
  const [liked, setLiked] = useState(false);
  const tap = useDoubleTap(() => setLiked(true));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      if (bar.current && el.duration) bar.current.style.transform = `scaleX(${el.currentTime / el.duration})`;
      raf = el.paused ? 0 : requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
    el.addEventListener("play", start);
    return () => {
      el.removeEventListener("play", start);
      cancelAnimationFrame(raf);
    };
  }, [ref]);

  return (
    <figure className={styles.figure}>
      <div className={styles.phone}>
        <div className={styles.story} onPointerUp={tap.onPointerUp}>
          <video ref={ref} src={`${src}#t=0.1`} muted loop playsInline preload="auto" aria-label={label} controls={reduced} />
          <Burst n={tap.burst} />
          <div className={styles.top}>
            <div className={styles.bars} aria-hidden>
              <span><span ref={bar} /></span>
              <span />
              <span />
            </div>
            <div className={styles.profile}>
              <Avatar size={30} />
              <strong>fluid</strong>
              <span className={styles.ago}>{t.videos.ago}</span>
              <span className={styles.spacer} />
              <span className={styles.ghost} aria-hidden><Icon name="more" size={20} /></span>
              <span className={styles.ghost} aria-hidden><Icon name="close" size={22} /></span>
            </div>
          </div>
          <div className={styles.bottom}>
            <span className={styles.reply}>{t.videos.reply}</span>
            <Like liked={liked} onToggle={() => setLiked((l) => !l)} />
            <span className={styles.ghost} aria-hidden><Icon name="share" /></span>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>{label}</figcaption>
    </figure>
  );
}

export function PostVideo({ src, label }: { src: string; label: string }) {
  const { lang, t } = useLang();
  const { ref, reduced } = useVideo();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const tap = useDoubleTap(() => setLiked(true));
  const likes = 1204 + (liked ? 1 : 0);

  return (
    <figure className={styles.figure}>
      <article className={styles.post}>
        <header className={styles.postHead}>
          <Avatar size={34} />
          <strong>fluid</strong>
          <span className={styles.follow}>{t.videos.follow}</span>
          <span className={styles.spacer} />
          <span className={styles.ghost} aria-hidden><Icon name="more" size={20} /></span>
        </header>
        <div className={styles.media} onPointerUp={tap.onPointerUp}>
          <video ref={ref} src={`${src}#t=0.1`} muted loop playsInline preload="auto" aria-label={label} controls={reduced} />
          <Burst n={tap.burst} />
        </div>
        <div className={styles.actions}>
          <Like liked={liked} onToggle={() => setLiked((l) => !l)} />
          <span className={styles.ghost} aria-hidden><Icon name="comment" /></span>
          <span className={styles.ghost} aria-hidden><Icon name="share" /></span>
          <span className={styles.spacer} />
          <button type="button" className={styles.icon} aria-pressed={saved} aria-label={t.videos.save} onClick={() => setSaved((s) => !s)}>
            <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
              <path {...stroke} fill={saved ? "currentColor" : "none"} d="M6 3.5h12v17l-6-4.5-6 4.5v-17Z" />
            </svg>
          </button>
        </div>
        <p className={styles.likes}>
          {likes.toLocaleString(lang === "pt" ? "pt-BR" : "en-US")} {t.videos.likes}
        </p>
        <p className={styles.text}>
          <strong>fluid</strong> {t.videos.caption}
        </p>
      </article>
      <figcaption className={styles.caption}>{label}</figcaption>
    </figure>
  );
}
