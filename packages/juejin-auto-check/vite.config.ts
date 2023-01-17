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

        name: "掘金自动签到",
        description:
          "在用户打开掘金页面后, 自动签到, 每天最多签到一次. 基于iframe实现, 不用担心接口被禁. 只支持 Chrome80+ 浏览器.",
        author: "sutie",
        match: ["https://juejin.cn/*"],
        grant: "none",
        "run-at": "document-idle",
        noframes: true,
        license: "MIT",
      },
      build: {
        minifyCss: false,
      },
    }),
  ],
});
