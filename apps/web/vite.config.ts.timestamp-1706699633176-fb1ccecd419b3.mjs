// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";
import { defineConfig } from "file:///Users/saventiyyzefovich/Desktop/Projects/room-sharing-bot/node_modules/.pnpm/vite@5.0.10_@types+node@18.19.4/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/saventiyyzefovich/Desktop/Projects/room-sharing-bot/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.0.10_vue@3.4.5/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///Users/saventiyyzefovich/Desktop/Projects/room-sharing-bot/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.5/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///Users/saventiyyzefovich/Desktop/Projects/room-sharing-bot/node_modules/.pnpm/unplugin-auto-import@0.17.3_@vueuse+core@10.7.1/node_modules/unplugin-auto-import/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///Users/saventiyyzefovich/Desktop/Projects/room-sharing-bot/apps/web/vite.config.ts";
var vite_config_default = defineConfig({
  server: {
    host: true,
    port: 1234,
    https: process.env.NODE_ENV === "production" ? void 0 : {
      key: readFileSync("./https-key.pem"),
      cert: readFileSync("./https-certificate.pem")
    }
  },
  plugins: [
    vue(),
    Components({
      dts: true,
      dirs: ["src/components", "src/layouts"]
    }),
    AutoImport({
      dts: true,
      eslintrc: { enabled: true },
      imports: [
        "vue",
        "vue-router",
        "@vueuse/core",
        {
          from: "@vueuse/router",
          imports: ["useRouteParams", "useRouteQuery", "useRouteHash"]
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc2F2ZW50aXl5emVmb3ZpY2gvRGVza3RvcC9Qcm9qZWN0cy9yb29tLXNoYXJpbmctYm90L2FwcHMvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc2F2ZW50aXl5emVmb3ZpY2gvRGVza3RvcC9Qcm9qZWN0cy9yb29tLXNoYXJpbmctYm90L2FwcHMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zYXZlbnRpeXl6ZWZvdmljaC9EZXNrdG9wL1Byb2plY3RzL3Jvb20tc2hhcmluZy1ib3QvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdub2RlOmZzJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IHRydWUsXG4gICAgcG9ydDogMTIzNCxcbiAgICBodHRwczpcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiB7XG4gICAgICAgICAgICBrZXk6IHJlYWRGaWxlU3luYygnLi9odHRwcy1rZXkucGVtJyksXG4gICAgICAgICAgICBjZXJ0OiByZWFkRmlsZVN5bmMoJy4vaHR0cHMtY2VydGlmaWNhdGUucGVtJyksXG4gICAgICAgICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgZHRzOiB0cnVlLFxuICAgICAgZGlyczogWydzcmMvY29tcG9uZW50cycsICdzcmMvbGF5b3V0cyddLFxuICAgIH0pLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgZHRzOiB0cnVlLFxuICAgICAgZXNsaW50cmM6IHsgZW5hYmxlZDogdHJ1ZSB9LFxuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAnQHZ1ZXVzZS9jb3JlJyxcbiAgICAgICAge1xuICAgICAgICAgIGZyb206ICdAdnVldXNlL3JvdXRlcicsXG4gICAgICAgICAgaW1wb3J0czogWyd1c2VSb3V0ZVBhcmFtcycsICd1c2VSb3V0ZVF1ZXJ5JywgJ3VzZVJvdXRlSGFzaCddLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJYLFNBQVMsZUFBZSxXQUFXO0FBQzlaLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUx1TixJQUFNLDJDQUEyQztBQVEvUixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUNFLFFBQVEsSUFBSSxhQUFhLGVBQ3JCLFNBQ0E7QUFBQSxNQUNFLEtBQUssYUFBYSxpQkFBaUI7QUFBQSxNQUNuQyxNQUFNLGFBQWEseUJBQXlCO0FBQUEsSUFDOUM7QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDVCxLQUFLO0FBQUEsTUFDTCxNQUFNLENBQUMsa0JBQWtCLGFBQWE7QUFBQSxJQUN4QyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxLQUFLO0FBQUEsTUFDTCxVQUFVLEVBQUUsU0FBUyxLQUFLO0FBQUEsTUFDMUIsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLFNBQVMsQ0FBQyxrQkFBa0IsaUJBQWlCLGNBQWM7QUFBQSxRQUM3RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
