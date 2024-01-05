import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 1234,
    https:
      process.env.NODE_ENV === 'production'
        ? undefined
        : {
            key: readFileSync('./https-key.pem'),
            cert: readFileSync('./https-certificate.pem')
          }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
