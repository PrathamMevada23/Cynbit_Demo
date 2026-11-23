import { loadEnvConfig } from "@next/env";
import { defineConfig } from "@playwright/test";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !["127.0.0.1", "localhost", "[::1]"].includes(new URL(databaseUrl).hostname)) {
  throw new Error("Playwright requires a migrated, seeded loopback PostgreSQL database.");
}

const port = 3131;
const baseURL = `http://127.0.0.1:${port}`;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  timeout: 35_000,
  use: { baseURL, launchOptions: executablePath ? { executablePath } : {}, trace: "retain-on-failure" },
  webServer: {
    command: `pnpm start --hostname 127.0.0.1 --port ${port}`,
    url: baseURL + "/api/catalog",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
