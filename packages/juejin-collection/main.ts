// import { name as NAMESPACE } from "./package.json";
// const LOCALSTORAGE_KEY = "tampermonkey-" + NAMESPACE;

export default function main() {
  //

  let data: [];
  function getData() {
    const list = document.querySelector("ul.collection-list");
    if (!list) {
      return;
    }
    const items = Array.from(list.querySelectorAll<HTMLLinkElement>(".collection-card > a"));
    if (!items.length) {
      return;
    }
    data = items
      .map((item) => {
        if (!item) {
          return;
        }
        const id = item?.href?.match(/\d+/)?.[0];
        if (!id) {
          return;
        }
        return {
          id: +id,
          name: item.querySelector(".title")?.textContent,
          tag: item.querySelector(".tag-default")?.textContent,
          isLock: !!item.querySelector(".title+svg"),
          lastUpdate: item.querySelector(".lasted-time")?.textContent?.match(/\d+-\d+-\d+/)?.[0],
          count: +(item.querySelector(".footer-left")?.textContent?.match(/(\d+)篇/)?.[1] || 0),
          subscribe: +(item.querySelector(".footer-left")?.textContent?.match(/(\d+)订阅/)?.[1] || 0),
          updateAt: item.querySelector(".footer-left")?.textContent?.match(/\d+-\d+-\d+/)?.[0],
        };
      })
      .filter((item) => item && item.id);
  }

  const timer = setInterval(() => {
    getData();
    if (data) {
      console.log(data)
      // TODO display panel
      clearInterval(timer);
    }
  }, 500);
}
