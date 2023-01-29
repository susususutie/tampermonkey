import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../../dist", // workspace/dist
    target: "chrome80",
  },
  plugins: [
    monkey({
      entry: "index.ts",
      userscript: {
        icon: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png",
        namespace: "http://tampermonkey.net/",

        name: "[掘金]显示文章收藏数",
        description: "在文章列表页面展示文章收藏数. 原理是劫持原生的 `fetch` 请求, 在获取文章列表的请求后更改DOM.",
        author: "sutie",
        match: [
          "https://juejin.cn/recommended",
          "https://juejin.cn/following",
          "https://juejin.cn/backend",
          "https://juejin.cn/frontend",
          "https://juejin.cn/android",
          "https://juejin.cn/ios",
          "https://juejin.cn/ai",
          "https://juejin.cn/freebie",
          "https://juejin.cn/career",
          "https://juejin.cn/article",
        ],
        grant: "none",
        "run-at": "document-start",
        noframes: true,
        license: "MIT",
      },
      build: {
        minifyCss: false,
      },
    }),
  ],
});
