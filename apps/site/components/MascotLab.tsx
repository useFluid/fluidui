"use client";

import { Mascot } from "@usefluid/registry/mascot/Mascot.tsx";
import { objects, pickObject } from "@usefluid/registry/mascot/objects.ts";
import type { Mood } from "@usefluid/registry/pet/Pet.tsx";
import { SegmentedPicker } from "@usefluid/registry/segmented-picker/SegmentedPicker.tsx";
import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";
import styles from "./MascotLab.module.css";

const MOODS: Mood[] = ["idle", "happy", "curious", "surprised", "sleepy"];

export function MascotGenerator() {
  const { lang, t } = useLang();
  const m = t.mascots;
  const [text, setText] = useState("");
  const [object, setObject] = useState(objects[0]);
  const [mood, setMood] = useState<Mood>("idle");

  useEffect(() => {
    if (!text.trim()) return;
    const timer = setTimeout(() => {
      const next = pickObject(text);
      setObject((current) => {
        if (current.id !== next.id) setMood("happy");
        return next;
      });
    }, 260);
    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    if (mood !== "happy") return;
    const timer = setTimeout(() => setMood("idle"), 1900);
    return () => clearTimeout(timer);
  }, [mood, object]);

  return (
    <section className={styles.generator}>
      <div className={styles.stage}>
        <button
          type="button"
          className={styles.big}
          aria-label={`${object.name[lang]}. ${m.next}`}
          onClick={() => {
            setObject((current) => objects[(objects.indexOf(current) + 7) % objects.length]);
            setMood("happy");
          }}
        >
          <Mascot object={object} mood={mood} follow />
        </button>
        <p className={styles.name} aria-live="polite">{object.name[lang]}</p>
      </div>
      <div className={styles.controls}>
        <label className={styles.label} htmlFor="mascot-text">{m.label}</label>
        <input
          id="mascot-text"
          className={styles.input}
          value={text}
          placeholder={m.placeholder}
          autoComplete="off"
          onChange={(e) => {
            setText(e.target.value);
            setMood("curious");
          }}
        />
        <div className={styles.examples}>
          <span className={styles.try}>{m.try}</span>
          {m.examples.map((example) => (
            <button key={example} type="button" className={styles.chip} onClick={() => setText(example)}>
              {example}
            </button>
          ))}
        </div>
        <SegmentedPicker<Mood>
          label={m.mood}
          value={mood}
          onChange={setMood}
          options={MOODS.map((value) => ({ value, label: m.moods[value] }))}
        />
      </div>
    </section>
  );
}

function GalleryTile({ start }: { start: number }) {
  const { lang, t } = useLang();
  const [index, setIndex] = useState(start);
  const [happy, setHappy] = useState(false);
  const o = objects[index % objects.length];

  useEffect(() => {
    if (!happy) return;
    const timer = setTimeout(() => setHappy(false), 1600);
    return () => clearTimeout(timer);
  }, [happy, index]);

  return (
    <li>
      <button
        type="button"
        className={styles.tile}
        aria-label={`${o.name[lang]}. ${t.mascots.next}`}
        onClick={() => {
          setIndex((i) => i + 7);
          setHappy(true);
        }}
      >
        <span className={styles.small}>
          <Mascot object={o} mood={happy ? "happy" : "idle"} follow />
        </span>
        <span className={styles.tileName} aria-live="polite">{o.name[lang]}</span>
      </button>
    </li>
  );
}

export function MascotGallery() {
  return (
    <ul className={styles.gallery}>
      {objects.map((o, i) => (
        <GalleryTile key={o.id} start={i} />
      ))}
    </ul>
  );
}
