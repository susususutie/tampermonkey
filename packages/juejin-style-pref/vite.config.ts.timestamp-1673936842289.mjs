// vite.config.ts
import { defineConfig } from "file:///C:/Users/sutie/Documents/tampermonkey/node_modules/.pnpm/vite@4.0.4/node_modules/vite/dist/node/index.js";
import monkey from "file:///C:/Users/sutie/Documents/tampermonkey/node_modules/.pnpm/vite-plugin-monkey@2.11.0_vite@4.0.4/node_modules/vite-plugin-monkey/dist/node/index.mjs";
var vite_config_default = defineConfig({
  build: {
    outDir: "../../dist",
    // workspace/dist
    target: "chrome80"
  },
  plugins: [
    monkey({
      entry: "index.ts",
      userscript: {
        icon: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png",
        namespace: "http://tampermonkey.net/",
        name: "\u6398\u91D1\u6837\u5F0F\u4F18\u5316",
        description: "\u4F18\u5316\u6398\u91D1\u7684\u9875\u9762\u6837\u5F0F.",
        author: "sutie",
        match: ["https://juejin.cn/*"],
        grant: "none",
        "run-at": "document-start",
        noframes: true,
        license: "MIT"
      },
      build: {
        minifyCss: false
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzdXRpZVxcXFxEb2N1bWVudHNcXFxcdGFtcGVybW9ua2V5XFxcXHBhY2thZ2VzXFxcXGp1ZWppbi1zdHlsZS1wcmVmXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzdXRpZVxcXFxEb2N1bWVudHNcXFxcdGFtcGVybW9ua2V5XFxcXHBhY2thZ2VzXFxcXGp1ZWppbi1zdHlsZS1wcmVmXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9zdXRpZS9Eb2N1bWVudHMvdGFtcGVybW9ua2V5L3BhY2thZ2VzL2p1ZWppbi1zdHlsZS1wcmVmL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IG1vbmtleSBmcm9tIFwidml0ZS1wbHVnaW4tbW9ua2V5XCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6IFwiLi4vLi4vZGlzdFwiLCAvLyB3b3Jrc3BhY2UvZGlzdFxyXG4gICAgdGFyZ2V0OiBcImNocm9tZTgwXCIsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBtb25rZXkoe1xyXG4gICAgICBlbnRyeTogXCJpbmRleC50c1wiLFxyXG4gICAgICB1c2Vyc2NyaXB0OiB7XHJcbiAgICAgICAgaWNvbjogXCJodHRwczovL2xmMy1jZG4tdG9zLmJ5dGVzY20uY29tL29iai9zdGF0aWMveGl0dV9qdWVqaW5fd2ViLy9zdGF0aWMvZmF2aWNvbnMvZmF2aWNvbi0zMngzMi5wbmdcIixcclxuICAgICAgICBuYW1lc3BhY2U6IFwiaHR0cDovL3RhbXBlcm1vbmtleS5uZXQvXCIsXHJcblxyXG4gICAgICAgIG5hbWU6IFwiXHU2Mzk4XHU5MUQxXHU2ODM3XHU1RjBGXHU0RjE4XHU1MzE2XCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiXHU0RjE4XHU1MzE2XHU2Mzk4XHU5MUQxXHU3Njg0XHU5ODc1XHU5NzYyXHU2ODM3XHU1RjBGLlwiLFxyXG4gICAgICAgIGF1dGhvcjogXCJzdXRpZVwiLFxyXG4gICAgICAgIG1hdGNoOiBbXCJodHRwczovL2p1ZWppbi5jbi8qXCJdLFxyXG4gICAgICAgIGdyYW50OiBcIm5vbmVcIixcclxuICAgICAgICBcInJ1bi1hdFwiOiBcImRvY3VtZW50LXN0YXJ0XCIsXHJcbiAgICAgICAgbm9mcmFtZXM6IHRydWUsXHJcbiAgICAgICAgbGljZW5zZTogXCJNSVRcIixcclxuICAgICAgfSxcclxuICAgICAgYnVpbGQ6IHtcclxuICAgICAgICBtaW5pZnlDc3M6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgXSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1ksU0FBUyxvQkFBb0I7QUFDN1osT0FBTyxZQUFZO0FBR25CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLElBQ1IsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLE9BQU87QUFBQSxNQUNQLFlBQVk7QUFBQSxRQUNWLE1BQU07QUFBQSxRQUNOLFdBQVc7QUFBQSxRQUVYLE1BQU07QUFBQSxRQUNOLGFBQWE7QUFBQSxRQUNiLFFBQVE7QUFBQSxRQUNSLE9BQU8sQ0FBQyxxQkFBcUI7QUFBQSxRQUM3QixPQUFPO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixVQUFVO0FBQUEsUUFDVixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ0wsV0FBVztBQUFBLE1BQ2I7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
