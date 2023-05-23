import { name as NAMESPACE } from "./package.json";
const LOCAL_STORAGE_KEY = "tampermonkey-" + NAMESPACE;

const apis: string[] = [
  "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed", // item_info
  "https://api.juejin.cn/recommend_api/v1/article/recommend_follow_feed",
  "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed",
  "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_tag_feed",
];

type ResultItem = {
  article_id: string;
  article_info: {
    user_id: string;
    collect_count: number;
  };
};

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

    // 屏蔽掘金的埋点请求
    // TODO: block xhr
    // https://api.juejin.cn/recommend_api/v1/dislike/white_list?aid=2608&uuid=7218014415927789116&spider=0
    if (
      typeof url === "string" &&
      ["https://mcs.snssdk.com/list"].includes(url)
    ) {
      // return Promise.resolve(new Response(returnStream, { headers: res.headers }))
    }

    if (
      typeof url === "string" &&
      url.startsWith("https://api.juejin.cn/recommend_api/v1/dislike/update")
    ) {
      console.log("block", url);
    }
    /**
     * 屏蔽作者
     */
    if (
      typeof url === "string" &&
      url.startsWith("https://api.juejin.cn/recommend_api/v1/dislike/update") &&
      isBlockAuthorBody(rest[1]?.body)
    ) {
      return new Promise((resolve, reject) => {
        originFetch
          .bind(this)(...rest)
          .then((res) => {
            if (res.body) {
              new Response(res.body, { headers: res.headers })
                .json()
                .then((result) => {
                  if (result && result.err_no === 3007) {
                    // console.log(result);
                    // data: null
                    // err_msg: "当前屏蔽作者已达20上限"
                    // err_no: 3007;

                    updateBlockedAuthor(rest[1]!.body);

                    resolve(
                      new Response(
                        JSON.stringify({
                          data: null,
                          err_msg: "success",
                          err_no: 0,
                        }),
                        { headers: res.headers, status: 200, statusText: "ok" }
                      )
                    );
                  }
                });
            }
          })
          .catch((err) => reject(err));
      });
    }

    /**
     * 过滤文章
     */
    if (
      typeof url === "string" &&
      apis.some((api) => new RegExp(api).test(url))
    ) {
      return new Promise((resolve, reject) => {
        originFetch
          .bind(this)(...rest)
          .then((res) => {
            if (res.body) {
              new Response(res.body, { headers: res.headers })
                .json()
                .then((result) => {
                  if (result && Array.isArray(result.data)) {
                    const newData = filterByBlockList(result.data);
                    resolve(
                      new Response(
                        JSON.stringify({ ...result, data: newData }),
                        { headers: res.headers }
                      )
                    );
                  }
                });
            }
          })
          .catch((err) => reject(err));
      });
    }

    return originFetch.bind(this)(...rest);
  };
}

function isBlockAuthorBody(body: any) {
  // action: 1
  // dis_type: 2
  // item_ids: ['3544481220801815']
  // item_type: 1
  if (typeof body === "string") {
    try {
      const bd = JSON.parse(body);
      return bd.action === 1 && bd.dis_type === 2 && bd.item_type === 1;
    } catch (error) {
      console.log(error);
    }
  }
  return false;
}

let blockList: number[] = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
);

function updateBlockedAuthor(body: any) {
  const authorID = +JSON.parse(body).item_ids[0];
  blockList.push(authorID);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blockList));
}

function filterByBlockList(list: ResultItem[] | { item_info: ResultItem }[]) {
  // @ts-ignore
  const filterList = list.filter((_item) => {
    const item = ("item_info" in _item ? _item.item_info : _item) as ResultItem;
    return +item.article_info.user_id % 2 === 0; // !blockList.includes(+item.article_info.user_id);
  });
  console.log(filterList);
  return filterList;
}

export {};

// const originOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function(...rest) {
//     console.log(rest[1])
//     originOpen(...rest).bind(this);
// }
// console.log(originOpen, XMLHttpRequest);
