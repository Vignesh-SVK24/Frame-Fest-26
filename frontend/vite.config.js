import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const audioMimePlugin = {
  name: 'audio-mime-fix',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.includes('.mp3.mpeg')) {
        res.setHeader('Content-Type', 'audio/mpeg');
      }
      next();
    });
  }
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), audioMimePlugin],
  base: process.env.VITE_BASE_URL || (mode === 'production' ? '/Frame-Fest-26/' : '/'),
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
}));
