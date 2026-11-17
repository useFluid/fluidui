export const BY_HAND = ["by-hand", "recipes", "troubleshooting", "reference"] as const;

export const GUIDE = ["intro", "installation", ...BY_HAND, "theming", "engine", "cli", "skills", "video", "accessibility", "contributing"] as const;
export type GuidePage = (typeof GUIDE)[number];
export const guidePath = (page: GuidePage) => (page === "intro" ? "/docs" : `/docs/${page}`);
