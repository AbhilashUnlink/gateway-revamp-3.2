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
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'router-vendor', test: /node_modules[\\/]react-router/ },
            {
              name: 'redux-vendor',
              test: /node_modules[\\/](@reduxjs[\\/]toolkit|react-redux|redux|redux-persist|immer|reselect)[\\/]/,
            },
            { name: 'forms-vendor', test: /node_modules[\\/]react-hook-form[\\/]/ },
            { name: 'i18n-vendor', test: /node_modules[\\/](i18next|react-i18next)[\\/]/ },
            { name: 'table-vendor', test: /node_modules[\\/]@tanstack[\\/]/ },
            {
              name: 'ui-vendor',
              test: /node_modules[\\/](@headlessui|react-tooltip|react-datepicker|react-hot-toast|lucide-react|date-fns)[\\/]/,
            },
            { name: 'axios-vendor', test: /node_modules[\\/]axios[\\/]/ },
          ],
        },
      },
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
