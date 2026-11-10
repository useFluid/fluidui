import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  workers: 2,
  use: { baseURL: "http://127.0.0.1:3200", channel: "msedge" },
  webServer: {
    command: "npx next start -H 127.0.0.1 -p 3200",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
