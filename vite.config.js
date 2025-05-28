import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  //envPrefix: 'REACT_APP_',
  plugins: [
    react(), 
    //envCompatible()
  ],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': { // Any request starting with /api will be proxied
        target: 'https://crypto-sphere-risk-manager-backend.onrender.com',
        changeOrigin: true, // Needed for virtual hosting sites
        secure: false, // For development, if your backend isn't using HTTPS yet
      }
    }
  }
});