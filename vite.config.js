// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { imageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [react(), tailwindcss(), imageOptimizer()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          framer: ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase', 'framer-motion'],
  },
});