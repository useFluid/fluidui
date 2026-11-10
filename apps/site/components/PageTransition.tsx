import { ViewTransition } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ lang: "none", "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-in" }}
      exit={{ lang: "none", "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-out" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
