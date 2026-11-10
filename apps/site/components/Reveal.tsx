"use client";

import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

export function Reveal({ children, as: Tag = "div", className }: { children: ReactNode; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={["reveal", className].filter(Boolean).join(" ")} data-shown={shown || undefined}>
      {children}
    </Tag>
  );
}
