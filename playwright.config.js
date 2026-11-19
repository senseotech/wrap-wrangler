import { defineConfig, devices } from '@playwright/test';

const port = 4173;

export default defineConfig({
  testDir: './tests/browser',
  workers: 1, // Clipboard paste uses the system clipboard.
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  projects: [
    { name: 'desktop', use: devices['Desktop Chrome'] },
    { name: 'mobile viewport', use: devices['Pixel 7'] },
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    port,
  },
});
