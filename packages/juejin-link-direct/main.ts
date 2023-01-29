// import { name as NAMESPACE } from "./package.json";
// const LOCALSTORAGE_KEY = "tampermonkey-" + NAMESPACE;

function callback(a: HTMLAnchorElement) {
  const href = new URLSearchParams(
    new URL(decodeURIComponent(a.href)).search.slice(1)
  ).get("target");
  if (href) {
    a.href = href;
    a.title = a.href;
  }
}

export default function main() {
  let mutateTimes = 10;
  let timer = setInterval(() => {
    const postWrap = document.querySelector(".article-content");
    if (!postWrap) {
      return;
    }
    document
      .querySelectorAll<HTMLAnchorElement>(
        'a[href^="https://link.juejin.cn/?target="]'
      )
      .forEach(callback);
    document
      .querySelectorAll<HTMLAnchorElement>(
        'a[href^="https://link.juejin.cn?target="]'
      )
      .forEach(callback);

    mutateTimes -= 1;
    if (mutateTimes < 0) {
      clearInterval(timer);
    }
  }, 500);
}
