import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const clipboardPermissions = ['clipboard-read', 'clipboard-write'];

export default defineConfig({
  testDir: './tests/browser',
  workers: 1, // Clipboard paste uses the system clipboard.
  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], permissions: clipboardPermissions } },
    { name: 'mobile viewport', use: { ...devices['Pixel 7'], permissions: clipboardPermissions } },
    { name: 'mobile webkit', use: devices['iPhone 15'] },
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    port,
  },
});
