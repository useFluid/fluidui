export const FLUID_DEV_ONLY = "FLUID_DEV_ONLY";

export const isDev = () => typeof process !== "undefined" && process.env.NODE_ENV !== "production";

const warned = new Set<string>();

export function warnOnce(code: string, message: string) {
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    const key = `${code}|${message}`;
    if (warned.has(key)) return;
    warned.add(key);
    console.warn(message);
  }
}

export const docsLink = (code: string) => `https://fluidui.willradoux.com/docs/troubleshooting#${code}`;
