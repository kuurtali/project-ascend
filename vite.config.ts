/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages alt dizinde yayınlanır
  base: process.env.GITHUB_PAGES ? '/project-ascend/' : '/',
  build: { outDir: 'dist' },
  test: {
    // Motor testleri saf düğümde koşar; ekran testleri DOM ister.
    environment: 'node',
    environmentMatchGlobs: [['**/*.test.tsx', 'jsdom']],
  },
});
