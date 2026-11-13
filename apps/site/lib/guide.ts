export const GUIDE = ["intro", "installation", "theming", "engine", "cli", "skills", "video", "accessibility", "contributing"] as const;
export type GuidePage = (typeof GUIDE)[number];
export const guidePath = (page: GuidePage) => (page === "intro" ? "/docs" : `/docs/${page}`);
