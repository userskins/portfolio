import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Separate entry and output: the existing portfolio is never overwritten.
export default defineConfig({
  root: path.resolve(import.meta.dirname, 'client/studio'),
  base: process.env.STUDIO_BASE ?? '/studio/',
  plugins: [react()],
  css: { postcss: { plugins: [] } },
  resolve: { alias: {
    '@': path.resolve(import.meta.dirname, 'client/src'),
    '@assets': path.resolve(import.meta.dirname, 'attached_assets'),
    '@shared': path.resolve(import.meta.dirname, 'shared'),
  } },
  build: { outDir: path.resolve(import.meta.dirname, 'dist/studio'), emptyOutDir: true },
  server: { host: '0.0.0.0', port: 4173, fs: { allow: [import.meta.dirname] } },
});
