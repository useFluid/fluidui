"use client";

import { fitPath } from "@usefluid/motion";
import { type Brand, brands } from "@usefluid/registry/brands.ts";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "fluid-brand";

type Custom = { logo: string; color: string };

type Value = {
  brand: Brand;
  brandId: string;
  custom: Custom | null;
  name: string;
  select(id: string): void;
  setCustom(custom: Custom): void;
  setName(name: string): void;
};

const Context = createContext<Value | null>(null);

function luminance(hex: string) {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

export const CUSTOM_ID = "sua";

function customBrand(custom: Custom): Brand {
  return {
    id: CUSTOM_ID,
    name: "Your brand",
    logo: custom.logo,
    vars: {
      "--fluid-accent": custom.color,
      "--fluid-on-accent": luminance(custom.color) > 0.18 ? "#0b0b0c" : "#ffffff",
      "--fluid-focus": custom.color,
    },
  };
}

function readStored(): { id: string; custom: Custom | null; name: string } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    let custom: Custom | null = null;
    if (data.custom && /^#[0-9a-f]{6}$/i.test(data.custom.color)) {
      custom = { logo: fitPath(data.custom.logo, 120), color: data.custom.color };
    }
    return { id: String(data.id), custom, name: typeof data.name === "string" ? data.name.slice(0, 40) : "" };
  } catch {
    return null;
  }
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brandId, setBrandId] = useState(brands[0].id);
  const [custom, setCustomState] = useState<Custom | null>(null);
  const [name, setNameState] = useState("");

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setCustomState(stored.custom);
      setNameState(stored.name);
      if (stored.id !== CUSTOM_ID || stored.custom) setBrandId(stored.id);
    }
  }, []);

  const persist = useCallback((id: string, c: Custom | null, n: string) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ id, custom: c, name: n }));
    } catch {
    }
  }, []);

  const value = useMemo<Value>(() => {
    const base =
      brandId === CUSTOM_ID && custom ? customBrand(custom) : (brands.find((b) => b.id === brandId) ?? brands[0]);
    const brand = name.trim() ? { ...base, name: name.trim() } : base;
    return {
      brand,
      brandId: brand.id,
      custom,
      name,
      select(id) {
        setBrandId(id);
        persist(id, custom, name);
      },
      setCustom(next) {
        setCustomState(next);
        setBrandId(CUSTOM_ID);
        persist(CUSTOM_ID, next, name);
      },
      setName(next) {
        const clean = next.slice(0, 40);
        setNameState(clean);
        persist(brandId, custom, clean);
      },
    };
  }, [brandId, custom, name, persist]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBrand() {
  const value = useContext(Context);
  if (!value) throw new Error("useBrand needs BrandProvider");
  return value;
}
