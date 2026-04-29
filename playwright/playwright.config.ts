import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173';
const ROOT = __dirname;

export default defineConfig({
  testDir: path.join(ROOT, 'tests'),
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(ROOT, 'reports', 'html'), open: 'never' }],
    ['junit', { outputFile: path.join(ROOT, 'reports', 'junit.xml') }],
  ],
  outputDir: path.join(ROOT, 'reports', 'artifacts'),
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: process.env.CI
    ? {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : undefined,
});
