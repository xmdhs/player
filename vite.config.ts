import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from "path";
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    sourcemap: true,
  },
  base: "/",
  resolve: {
    alias: {
      '@': join(__dirname, "src")
    }
  }
})
