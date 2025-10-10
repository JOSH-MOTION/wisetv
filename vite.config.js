import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'; // <-- Now using the installed plugin!

// This configuration implements:
// 1. Rollup's manualChunks (for JS code splitting, already successful)
// 2. Automatic Image Optimization (to fix the massive image asset sizes)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 2. Add the Image Optimizer Plugin with configuration
    ViteImageOptimizer({
      // Configure quality for different formats. Converting to WebP is the key.
      jpeg: { quality: 75 },
      png: { quality: 80 },
      
      // WebP configuration for best compression
      webp: {
        lossless: false,
        quality: 75
      },
      
      // Include all image types
      include: ['**/*.jpg', '**/*.jpeg', '**/*.png'],
      
      // Crucial: Tell the plugin to convert JPG and PNG files to WebP
      convert: [
        { from: 'jpeg', to: 'webp' },
        { from: 'png', to: 'webp' },
      ],
    }),
  ],
  // base: '/wisetv/', 
  build: {
    // Keep the chunk size warning limit adjustment
    chunkSizeWarningLimit: 1000, 
    
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-[hash].css';
          }
          // The optimizer handles the image file extension change (e.g., .jpg -> .webp)
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
});