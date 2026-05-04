import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    // Exclude Playwright e2e specs from Vitest discovery — they live under
    // playwright/ and are run by `npm run test:e2e` instead.
    exclude: ['node_modules', 'dist', 'playwright/**'],
  },
});
