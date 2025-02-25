import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/CustomTees/',  // Add this line - should match your repository name
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  assetsInclude: ['**/*.glb'],  // Ensure GLB files are handled as assets
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});