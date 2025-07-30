import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/game23/', // El nombre de tu repo entre las barras
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optimizaciones para el build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
})