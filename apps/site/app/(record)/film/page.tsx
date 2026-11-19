import type { Metadata } from "next";
import { Film } from "@/components/film/Film";

export const metadata: Metadata = { title: "Film", robots: { index: false } };

export default function FilmPage() {
  return <Film />;
}
