import { defineConfig, devices } from "@playwright/test";

// Browser-only failure-state checks. API responses are explicitly simulated;
// this suite does not replace the PostgreSQL integration and end-to-end gates.
export default defineConfig({
  testDir: "./tests/access",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:5173", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "node node_modules/vite/bin/vite.js apps/web --host 127.0.0.1 --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
  },
});
