import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use relative paths for native app compatibility
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom'],
          // React Router
          'vendor-router': ['react-router-dom'],
        },
      },
    },
  },
  // Fixed port for Tauri dev server
  server: {
    port: 5173,
    strictPort: true,
  },
  // Clear screen disabled for Tauri compatibility
  clearScreen: false,
})
