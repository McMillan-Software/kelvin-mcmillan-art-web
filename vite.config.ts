import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // framer-motion ships "use client" directives for React Server
        // Components. This is a client-only SPA, so Rollup stripping them is
        // expected — the warnings are noise, not a problem.
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('use client')
        ) {
          return
        }
        warn(warning)
      },
    },
  },
})
