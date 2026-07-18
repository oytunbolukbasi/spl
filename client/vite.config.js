import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Client builds into client/dist; server serves that folder.
// Dev server proxies /api and /pdfs to the Express server on :3000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/pdfs': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
