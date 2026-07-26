import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages alt dizinde yayınlanır
  base: process.env.GITHUB_PAGES ? '/project-ascend/' : '/',
  build: { outDir: 'dist' },
});
