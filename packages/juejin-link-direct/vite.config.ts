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
        name: "[掘金]外链直达",
        description: "掘金文章中的外链点击直接跳转.",
        author: "sutie",
        match: ["https://juejin.cn/post/*"],
        grant: "none",
        "run-at": "document-body",
        noframes: true,
        license: "MIT",
      },
      build: {
        minifyCss: false,
      },
    }),
  ],
});
