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

function main() {
  const postWrap = document.querySelector(".article-content");
  if (postWrap) {
    let mutateTimes = 3;
    const observer = new MutationObserver(() => {
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
      mutateTimes = mutateTimes - 1;
      if (mutateTimes <= 0) {
        observer.disconnect();
      }
    });
    observer.observe(postWrap, {
      attributes: false,
      childList: true,
      subtree: false,
    });
  }
}

main();

export {};
