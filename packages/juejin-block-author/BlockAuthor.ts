import { name as NAMESPACE } from "./package.json";
const LOCAL_STORAGE_KEY = "tampermonkey-" + NAMESPACE;

type ResultItem = {
  article_id: string;
  article_info: {
    user_id: string;
    collect_count: number;
  };
};

export default class BlockAuthor {
  #isBlockListFull: boolean = false;
  setFull(bool: boolean) {
    this.#isBlockListFull = bool;
  }
  ifFull() {
    return this.#isBlockListFull;
  }

  #blockAuthorList: number[] = [];
  constructor() {
    this.#initBlockAuthorList();
  }
  #initBlockAuthorList() {
    try {
      this.#blockAuthorList = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
      );
    } catch (error) {
      this.#blockAuthorList = [];
    }
  }
  #updateBlockListStore() {
    try {
      console.log(this.#blockAuthorList);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(this.#blockAuthorList)
      );
    } catch (error) {}
  }
  #timer: number | null = null;
  updateBlockedAuthor(authorID: number) {
    this.#blockAuthorList.push(authorID);
    this.#timer && cancelIdleCallback(this.#timer);
    this.#timer = requestIdleCallback(() => {
      this.#updateBlockListStore();
    });
  }

  filter(list) {
    const filterList = list.filter((_item, index) => {
      const item = (
        "item_info" in _item ? _item.item_info : _item
      ) as ResultItem;
      return (
        item?.article_info?.user_id &&
        !this.#blockAuthorList.includes(+item.article_info.user_id)
      );
    });
    return filterList;
  }
}

// TODO: proxy xhr ------------------------------------------------------------------------- //

// const OriginAjax = ((window as any).__XMLHttpRequest ||
//   window.XMLHttpRequest) as XMLHttpRequest;
// (window as any).__XMLHttpRequest = OriginAjax;

// class MyAjax extends XMLHttpRequest {
//   constructor() {
//     super();
//     this.originOpen = this.open;
//     this.open = function (methods, url, ...rest) {
//       if (url === "https://mcs.snssdk.com/list") {
//         return false;
//       }
//       this.originOpen(methods, url, ...rest);
//     };
//   }
// }

// window.XMLHttpRequest = MyAjax;
// TODO: proxy xhr ------------------------------------------------------------------------- //
