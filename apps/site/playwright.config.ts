import { defineConfig } from "@playwright/test";

const ci = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  workers: 2,
  retries: ci ? 1 : 0,
  reporter: ci ? [["github"], ["list"]] : "list",
  use: { baseURL: "http://127.0.0.1:3200", trace: "retain-on-failure" },
  projects: [
    { name: "edge", use: { channel: "msedge" } },
    {
      name: "webkit",
      use: { browserName: "webkit", launchOptions: process.env.WEBKIT_PATH ? { executablePath: process.env.WEBKIT_PATH } : {} },
      grep: /no errors and no accessibility problems|does not scroll sideways|keeps the theme|keeps you on the same page|work without JavaScript|Markdown for agents/,
    },
  ],
  webServer: {
    command: "npx next start -H 127.0.0.1 -p 3200",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: !ci,
    timeout: 60_000,
  },
});
