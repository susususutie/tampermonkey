// import { name as NAMESPACE } from "./package.json";
// const LOCALSTORAGE_KEY = "tampermonkey-" + NAMESPACE;

const apis: string[] = [
  "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed", // item_info
  "https://api.juejin.cn/recommend_api/v1/article/recommend_follow_feed",
  "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed",
  "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_tag_feed",
];

interface ResultItem {
  article_id: string;
  article_info: {
    collect_count: number;
  };
}

function callback(list: ResultItem[] | { item_info: ResultItem }[]) {
  list.forEach((_item) => {
    const item = "item_info" in _item ? _item.item_info : _item;
    const list = document.querySelector<HTMLUListElement>(
      `[data-entry-id="${item.article_id}"] .action-list`
    );
    if (!list) {
      return;
    }

    const firstEle = list.children[0] as HTMLLIElement;
    const dataV = Object.keys(firstEle.dataset).find(
      (k) => k.startsWith("v-") || k.startsWith("v")
    );
    if (!dataV) {
      return;
    }

    const li = document.createElement("li");
    li.dataset[dataV] = "";
    li.classList.add("item");

    const label = document.createElement("span");
    label.innerText = "收藏: ";
    label.dataset[dataV] = "";
    li.appendChild(label);

    const value = document.createElement("span");
    value.innerText = `${item.article_info.collect_count}`;
    value.dataset[dataV] = "";
    li.appendChild(value);

    list.appendChild(li);
  });
}

export default function main() {
  const originFetch = fetch;
  window.fetch = function (...rest) {
    const url = rest[0];

    if (
      typeof url === "string" &&
      apis.some((api) => new RegExp(api).test(url))
    ) {
      return new Promise((resolve, reject) => {
        originFetch
          .bind(this)(...rest)
          .then((res) => {
            if (res.body) {
              const [copyStream, returnStream] = res.body.tee();
              new Response(copyStream, { headers: res.headers })
                .json()
                .then((result) => {
                  if (result && Array.isArray(result.data)) {
                    setTimeout(() => {
                      callback(result.data);
                    }, 1000);
                  }
                });
              resolve(new Response(returnStream, { headers: res.headers }));
            }
          })
          .catch((err) => reject(err));
      });
    }
    return originFetch.bind(this)(...rest);
  };
}

export {};

// const originOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function(...rest) {
//     console.log(rest[1])
//     originOpen(...rest).bind(this);
// }
// console.log(originOpen, XMLHttpRequest);
