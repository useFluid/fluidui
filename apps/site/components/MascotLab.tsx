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
        <div className={styles.big}>
          <Mascot object={object} mood={mood} follow label={object.name[lang]} />
        </div>
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

export function MascotGallery() {
  const { lang } = useLang();
  const [moods, setMoods] = useState<Record<string, number>>({});
  return (
    <ul className={styles.gallery}>
      {objects.map((o) => {
        const step = moods[o.id] ?? 0;
        const mood = MOODS[step % MOODS.length];
        return (
          <li key={o.id}>
            <button
              type="button"
              className={styles.tile}
              aria-label={`${o.name[lang]}: ${mood}`}
              onClick={() => setMoods((all) => ({ ...all, [o.id]: step + 1 }))}
            >
              <span className={styles.small}>
                <Mascot object={o} mood={mood} follow />
              </span>
              <span className={styles.tileName}>{o.name[lang]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
