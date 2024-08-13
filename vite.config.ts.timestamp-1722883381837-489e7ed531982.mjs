// vite.config.ts
import { defineConfig } from "file:///home/batuevio/calculator-ui/node_modules/.pnpm/vite@5.3.4/node_modules/vite/dist/node/index.js";
import vue from "file:///home/batuevio/calculator-ui/node_modules/.pnpm/@vitejs+plugin-vue@4.4.0_vite@5.3.4_vue@3.3.6_typescript@5.2.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import postcssPresetEnv from "file:///home/batuevio/calculator-ui/node_modules/.pnpm/postcss-preset-env@9.2.0_postcss@8.4.31/node_modules/postcss-preset-env/dist/index.mjs";
import vuetify from "file:///home/batuevio/calculator-ui/node_modules/.pnpm/vite-plugin-vuetify@1.0.2_vite@5.3.4_vue@3.3.6_typescript@5.2.2__vuetify@3.3.22/node_modules/vite-plugin-vuetify/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [vue(), vuetify()],
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          features: {
            "nesting-rules": true
          }
        })
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9iYXR1ZXZpby9jYWxjdWxhdG9yLXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9iYXR1ZXZpby9jYWxjdWxhdG9yLXVpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2JhdHVldmlvL2NhbGN1bGF0b3ItdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCBwb3N0Y3NzUHJlc2V0RW52IGZyb20gJ3Bvc3Rjc3MtcHJlc2V0LWVudic7XG5pbXBvcnQgdnVldGlmeSBmcm9tICd2aXRlLXBsdWdpbi12dWV0aWZ5JztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW3Z1ZSgpLCB2dWV0aWZ5KCldLFxuXHRjc3M6IHtcblx0XHRwb3N0Y3NzOiB7XG5cdFx0XHRwbHVnaW5zOiBbXG5cdFx0XHRcdHBvc3Rjc3NQcmVzZXRFbnYoe1xuXHRcdFx0XHRcdGZlYXR1cmVzOiB7XG5cdFx0XHRcdFx0XHQnbmVzdGluZy1ydWxlcyc6IHRydWUsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSksXG5cdFx0XHRdLFxuXHRcdH0sXG5cdH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1EsU0FBUyxvQkFBb0I7QUFDblMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sc0JBQXNCO0FBQzdCLE9BQU8sYUFBYTtBQUVwQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztBQUFBLEVBQzFCLEtBQUs7QUFBQSxJQUNKLFNBQVM7QUFBQSxNQUNSLFNBQVM7QUFBQSxRQUNSLGlCQUFpQjtBQUFBLFVBQ2hCLFVBQVU7QUFBQSxZQUNULGlCQUFpQjtBQUFBLFVBQ2xCO0FBQUEsUUFDRCxDQUFDO0FBQUEsTUFDRjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
