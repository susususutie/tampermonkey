import { name as NAMESPACE } from "./package.json";

function insertStyle(id: string) {
  const style = document.createElement("style");
  style.id = id;
  style.innerHTML = `
.nav-item.link-item.download-icon,
.nav-item.vip-entry,
.special-activity,
.add-group > svg,
.timeline-content > .aside,
.btn.meiqia-btn {
  display: none !important;
}
.timeline-entry-list {
  margin-right: 0 !important;
}
#juejin > .view-container.container {
  max-width: 100% !important;
}
#juejin > .view-container.container > .container.with-view-nav {
  max-width: calc(100% - 2rem) !important;
}
#juejin > .view-container > .container.main-container {
  max-width: calc(100% - 7rem) !important;
  margin-right: 1rem;
}
.article-suspended-panel {
  margin-left: -5rem !important;
}
.main-area.article-area,
.main-area.recommended-area {
  width: auto !important;
  margin-right: 26rem !important;
}
.timeline-entry-list {
  width: auto !important;
}
#comment-box {
  max-width: 100% !important;
}  
`;
  document.head.appendChild(style);
}

export default function main() {
  const id = `id-${NAMESPACE}`;
  let times = 10;
  let timer = setInterval(() => {
    const style = document.getElementById(id);
    if (!style) {
      insertStyle(id);
    }

    if (document.readyState === "complete") {
      times -= 1;
    }
    if (times < 0) {
      clearInterval(timer);
    }
  }, 300);
}
