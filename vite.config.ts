import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Bind to all interfaces so the dev server is reachable over Tailscale
  // (and over the local network). `host: true` is shorthand for `0.0.0.0`.
  // The Pro Kit pages are still dev-only — they exist on this server, but they
  // never reach a production build.
  server: {
    host: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
