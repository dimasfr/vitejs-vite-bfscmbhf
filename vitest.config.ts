import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// test-only config, kept separate so `vite dev/build` never loads vitest
export default defineConfig({
  plugins: [vue()],
  test: { environment: 'jsdom', globals: true },
})
