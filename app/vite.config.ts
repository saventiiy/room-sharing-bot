import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

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
            cert: readFileSync('./https-certificate.pem'),
          },
  },
  plugins: [
    vue(),
    Components({
      dts: true,
      dirs: ['src/components', 'src/layouts'],
    }),
    AutoImport({
      dts: true,
      eslintrc: { enabled: true },
      imports: ['vue', 'vue-router', '@vueuse/core'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
