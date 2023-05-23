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

        name: "[掘金]屏蔽作者",
        description: "突破掘金黑名单20人的限制, 屏蔽你不想见到的作者.",
        author: "sutie",
        match: ["https://juejin.cn/*"], // 适用网址
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
