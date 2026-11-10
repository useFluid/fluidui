"use client";

import { type Mood, Pet } from "@usefluid/registry/pet/Pet.tsx";
import { type CSSProperties, useState } from "react";
import { useLang } from "./LangProvider";
import styles from "./PetParade.module.css";

const MOODS: Mood[] = ["idle", "happy", "surprised", "curious", "sleepy"];

const PETS: { name: string; bg: string; body: string; start: number }[] = [
  { name: "Drop", bg: "#6fc4fd", body: "#11100f", start: 0 },
  { name: "Ember", bg: "#ff5a1f", body: "#140200", start: 1 },
  { name: "Lime", bg: "#d6f21a", body: "#11100f", start: 3 },
  { name: "Night", bg: "#11100f", body: "#6fc4fd", start: 2 },
];

export function PetParade() {
  const { t } = useLang();
  const [moods, setMoods] = useState(PETS.map((p) => p.start));
  return (
    <ul className={styles.parade}>
      {PETS.map((pet, i) => {
        const mood = MOODS[moods[i] % MOODS.length];
        const label = t.moods[mood];
        return (
          <li key={pet.name} className={styles.card} style={{ "--bg": pet.bg, "--body": pet.body } as CSSProperties}>
            <button
              type="button"
              className={styles.button}
              onClick={() => setMoods((m) => m.map((v, j) => (j === i ? v + 1 : v)))}
              aria-label={`${pet.name}, ${label.toLowerCase()}. ${t.moods.change}`}
            >
              <span className={styles.pet}>
                <Pet mood={mood} follow />
              </span>
              <span className={styles.caption} aria-hidden>
                <strong>{pet.name}</strong> {label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
