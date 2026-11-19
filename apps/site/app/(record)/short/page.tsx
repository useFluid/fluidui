import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Short } from "@/components/film/Short";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-instrument" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = { title: "Short", robots: { index: false } };

export default function ShortPage() {
  return (
    <div className={`${display.variable} ${instrument.variable} ${mono.variable}`}>
      <Short />
    </div>
  );
}
