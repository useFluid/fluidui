import type { Metadata } from "next";
import { Fraunces, Inter_Tight, Space_Grotesk } from "next/font/google";
import "@usefluid/motion/theme.css";
import "../globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", preload: false });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap", preload: false });

export const metadata: Metadata = { title: "Record", robots: { index: false } };

export default function RecordLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${fraunces.variable} ${grotesk.variable}`} data-theme="light">
      <body>{children}</body>
    </html>
  );
}
