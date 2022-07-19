import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from "path";
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: "> 0.2%, last 2 versions, Firefox ESR, not dead"
    })
  ],
  build: {
    sourcemap: true,
  },
  base: "/",
  resolve: {
    alias: {
      '@': join(__dirname, "src")
    }
  },

})
