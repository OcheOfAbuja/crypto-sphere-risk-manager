import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': { // Any request starting with /api will be proxied
        target: 'http://localhost:5001', // Your backend URL
        changeOrigin: true, // Needed for virtual hosting sites
        secure: false, // For development, if your backend isn't using HTTPS yet
      }
    }
  }
});