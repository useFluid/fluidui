export const FLUID_DEV_ONLY = "FLUID_DEV_ONLY";

const warned = new Set<string>();

export function warnOnce(code: string, message: string) {
  try {
    if (process.env.NODE_ENV !== "production") {
      const key = `${code}|${message}`;
      if (warned.has(key)) return;
      warned.add(key);
      console.warn(message);
    }
  } catch {}
}

export const docsLink = (code: string) => `https://fluidui.willradoux.com/docs/troubleshooting#${code}`;
