import { name as NAMESPACE, version } from "./package.json";
import autoCheck from "juejin-auto-check/main";
import { version as autoCheckVersion } from "juejin-auto-check/package.json";
import linkDirect from "juejin-link-direct/main";
import { version as linkDirectVersion } from "juejin-link-direct/package.json";
import showCollection from "juejin-show-collection/main";
import { version as showCollectionVersion } from "juejin-show-collection/package.json";
import stylePref from "juejin-style-pref/main";
import { version as stylePrefVersion } from "juejin-style-pref/package.json";

enum WIDGET_ID {
  "auto-check" = 1,
  "link-direct",
  "show-collection",
  "style-pref",
}

const widgetIdMainMap = {
  [WIDGET_ID["auto-check"]]: autoCheck,
  [WIDGET_ID["link-direct"]]: linkDirect,
  [WIDGET_ID["show-collection"]]: showCollection,
  [WIDGET_ID["style-pref"]]: stylePref,
};

interface Widget {
  id: WIDGET_ID; // uid
  name: string; // 部件名称
  version: string;
  enable: boolean; // 是否启用
  reload: boolean; // 更改后是否需要重新刷新页面
}

const LOCALSTORAGE_KEY = "tampermonkey-" + NAMESPACE;

const DEFAULT_CONFIGS: Widget[] = [
  {
    id: WIDGET_ID["auto-check"],
    name: "自动签到",
    version: autoCheckVersion,
    enable: false,
    reload: true,
  },
  {
    id: WIDGET_ID["link-direct"],
    name: "外链直达",
    version: linkDirectVersion,
    enable: false,
    reload: true,
  },
  {
    id: WIDGET_ID["show-collection"],
    name: "显示文章收藏数",
    version: showCollectionVersion,
    enable: false,
    reload: true,
  },
  {
    id: WIDGET_ID["style-pref"],
    name: "样式优化",
    version: stylePrefVersion,
    enable: false,
    reload: true,
  },
];

function getConfig() {
  try {
    const data = localStorage.getItem(LOCALSTORAGE_KEY);
    if (data) {
      const configs = JSON.parse(data) as Widget[];
      return DEFAULT_CONFIGS.map((item) => {
        const memo = configs.find((c) => c.name === item.name);
        return memo ? { ...item, enable: memo.enable } : item;
      });
    } else {
      return DEFAULT_CONFIGS;
    }
  } catch (error) {
    return DEFAULT_CONFIGS;
  }
}

function renderItem() {
  const list = getConfig();

  const rightDom = document.querySelector<HTMLDivElement>(
    `#id-${NAMESPACE} .right`
  );
  if (!rightDom) {
    return;
  }
  rightDom.innerHTML = "";
  const frag = document.createDocumentFragment();
  list.forEach((widget) => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerText = `${widget.name} V${widget.version}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = widget.enable;
    checkbox.addEventListener("click", () => {
      handleClick(widget.id);
    });
    item.appendChild(checkbox);
    frag.appendChild(item);
  });
  rightDom.appendChild(frag);
}

function handleClick(id: number) {
  const config = getConfig();
  const newConfig = config.map((widget) =>
    id === widget.id ? { ...widget, enable: !widget.enable } : widget
  );
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newConfig));
  renderItem();
}

async function getConfigDom(): Promise<HTMLDivElement | null> {
  return new Promise((resolve) => {
    let timer = setInterval(() => {
      if (document.readyState !== "complete") return;
      const root = document.querySelector<HTMLDivElement>("#root");
      if (!root) {
        return;
      }
      const app = root.children[0] as HTMLDivElement;
      if (app.children[1]) {
        clearInterval(timer);
        const configDom = document.createElement("div");
        configDom.id = `id-${NAMESPACE}`;
        app.insertBefore(configDom, app.children[1]);
        resolve(configDom);
      }
    }, 500);

    setTimeout(() => {
      clearInterval(timer);
      resolve(null);
    }, 100 * 1000);
  });
}

async function insertConfigPanel() {
  const configDom = await getConfigDom();
  if (!configDom) {
    return;
  }

  const style = document.createElement("style");
  style.innerHTML = `
#id-juejin-in-all {
  height: 400px;
  display: flex;
  justify-content: space-evenly;
  background: linear-gradient(
    51.85deg,
    rgba(218, 230, 255, 0.9) 11.99%,
    rgba(193, 214, 255, 0) 96.36%
  );
}

#id-juejin-in-all .left {
  margin-top: 100px;
}
#id-juejin-in-all .left .title {
  margin-bottom: 8px;
  color: #252933;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
}
#id-juejin-in-all .left .desc {
  width: 528px;
  color: #515767;
  font-family: PingFang SC;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 63px;
}
#id-juejin-in-all .left .link {
  display: flex;
  flex-wrap: wrap;
  width: 528px;
}
#id-juejin-in-all .left .link a {
  color: #1e80ff;
  background: #fff;
  border-radius: 8px;
  user-select: none;
  width: 150px;
  margin-right: 30px;
  text-decoration: none;
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  height: 64px;
  line-height: 64px;
  text-align: center;
}
#id-juejin-in-all .left .link a:hover {
  background: rgba(255, 255, 255, 0.6);
}
#id-juejin-in-all .left .link a:first-of-type {
  color: #fff;
  background: #1e80ff;
}
#id-juejin-in-all .left .link a:first-of-type:hover {
  background: #1171ee;
}
#id-juejin-in-all .left .link a:last-of-type {
  margin-right: 0;
}

#id-juejin-in-all .right {
  width: 506px;
  margin-top: 100px;
}
#id-juejin-in-all .right .item {
  color: #252933;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  max-width: 50%;
  padding-bottom: 12px;
}
`;
  document.head.appendChild(style);

  configDom.innerHTML = `
  <div class="left">
    <div class="title">掘金助手 V${version}</div>
    <div class="desc">掘金插件多合一</div>
    <div class="link">
      <a href="https://greasyfork.org/zh-CN/scripts/459061-%E6%8E%98%E9%87%91-%E6%8E%98%E9%87%91%E5%8A%A9%E6%89%8B" target="__blank">脚本详情</a>
      <a href="https://greasyfork.org/zh-CN/scripts/459061-%E6%8E%98%E9%87%91-%E6%8E%98%E9%87%91%E5%8A%A9%E6%89%8B/feedback" target="__blank">问题反馈</a>
      <a href="https://greasyfork.org/zh-CN/users/1007708-susususutie" target="__blank">更多油猴脚本</a>
    </div>
  </div>
  <div class="right"></div>
  `;

  renderItem();
}

function main() {
  if (location.pathname === "/extension") {
    insertConfigPanel();
  } else {
    const config = getConfig();
    config.forEach((widget) => {
      if (widget.enable) {
        const fn = widgetIdMainMap[widget.id];
        if (typeof fn === "function") {
          fn();
        }
      }
    });
  }
}

main();

export {};
