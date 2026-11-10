import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Loopback only. The dev server can read the project tree; bind it wider with
  // `npm run dev -- --host` when that is intentional.
  // Pro Kit remains public: its route is product documentation, not paid assets.
  server: {
    host: '127.0.0.1',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
