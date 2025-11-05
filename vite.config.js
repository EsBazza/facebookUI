import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/posts': {
        target: 'https://facebookapi-2txh.onrender.com',
        changeOrigin: true,
        secure: true
        // no rewrite needed if backend expects /api/posts
      }
    }
  }
});
