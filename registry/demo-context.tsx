"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { brands } from "./brands";

export type Demo = {
  name: string;
  logo: string;
  play: boolean;
  auto: boolean;
};

const Context = createContext<Demo>({ name: brands[0].name, logo: brands[0].logo, play: true, auto: false });

export const DemoProvider = Context.Provider;
export const useDemo = () => useContext(Context);

export function useAutoplay(step: () => void, ms: number) {
  const { auto } = useDemo();
  const latest = useRef(step);
  useEffect(() => {
    latest.current = step;
  });
  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => latest.current(), ms);
    return () => clearInterval(timer);
  }, [auto, ms]);
}
