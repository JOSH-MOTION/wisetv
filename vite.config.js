import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Group React and ReactDOM together
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Group Firebase together
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Group other dependencies
          'ui-vendor': ['lucide-react', 'react-icons', 'framer-motion'],
          'carousel-vendor': ['react-responsive-carousel'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});