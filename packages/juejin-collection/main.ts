import { name as NAMESPACE } from "./package.json";
const LOCAL_STORAGE_KEY = "tampermonkey-" + NAMESPACE;

type Data = {
  id: string;
  name: string;
  desc: string;
  tag: string;
  permission: 0 | 1;
  count: number;
  subscribe: number;
  updateAt: string;
};

let data: Data[];

export default async function main() {
  // get data
  data = await asyncGetData();
  localStorage.setItem("collections", JSON.stringify(data));
  console.log(data);

  // gen dom
  appendDom();
}

function genAsyncFn<FnReturn = unknown>(
  fn: (...rest: unknown[]) => undefined | FnReturn,
  options?: { times?: number; interval?: number }
) {
  const { times = 5, interval = 500 } = options ?? {};
  let timesLast = times;

  return function asyncFn(...rest: unknown[]): Promise<FnReturn> {
    return new Promise((resolve, reject) => {
      let timer: number;
      function callFnLater() {
        clearTimeout(timer);
        if (timesLast > 0) {
          timer = setTimeout(() => {
            try {
              timesLast -= 1;
              const result = fn(...rest);
              if (typeof result === "undefined") {
                callFnLater();
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
            }
          }, interval);
        } else {
          reject("Timeout");
        }
      }
      callFnLater();
    });
    // let result;
    // while (typeof result === 'undefined') {
    //   setTimeout(() => {
    //     result = fn(...rest)
    //   }, 500);
    // }
  };
}

function getData() {
  const list = document.querySelector("ul.collection-list");
  if (!list) {
    return;
  }
  const items = Array.from(list.querySelectorAll<HTMLLinkElement>(".collection-card > a"));
  if (!items.length) {
    return;
  }
  return (items
    .map<Data | undefined>((item) => {
      if (!item) {
        return;
      }
      const id = item?.href?.match(/\d+/)?.[0];
      if (!id) {
        return;
      }

      return {
        id,
        name: item.querySelector(".title")?.textContent || "",
        desc:
          item
            .querySelector(".content-box")
            ?.textContent?.split("\n")
            .map((i) => i.trim())
            .filter(Boolean)
            .join("\n") || "",
        tag: item.querySelector(".tag-default")?.textContent || "",
        permission: !!item.querySelector(".title+svg") ? 1 : 0,
        // lastUpdate: item.querySelector(".lasted-time")?.textContent?.match(/\d+-\d+-\d+/)?.[0],
        count: +(item.querySelector(".footer-left")?.textContent?.match(/(\d+)篇/)?.[1] || 0),
        subscribe: +(item.querySelector(".footer-left")?.textContent?.match(/(\d+)订阅/)?.[1] || 0),
        updateAt: item.querySelector(".footer-left")?.textContent?.match(/\d+-\d+-\d+/)?.[0] || "",
      };
    })
    .filter((item) => item && item.id) || []) as Data[];
}

const asyncGetData = genAsyncFn(getData, { times: 10 });

const MOCK_DATA = [
  {
    id: "6845244237890650000",
    name: "库/前端",
    desc: "",
    permission: 0,
    lastUpdate: "2023-11-01",
    count: 22,
    subscribe: 0,
    updateAt: "2023-11-01",
  },
  {
    id: "7295396974827651000",
    name: "算法",
    desc: "算法\n算法\n算法\na",
    permission: 0,
    lastUpdate: "2023-10-31",
    count: 1,
    subscribe: 0,
    updateAt: "2023-10-31",
  },
  {
    id: "7268086678550741000",
    name: "Python",
    desc: "",
    permission: 1,
    lastUpdate: "2023-08-18",
    count: 1,
    subscribe: 0,
    updateAt: "2023-08-18",
  },
  {
    id: "7094425172806992000",
    name: "我的收藏",
    desc: "",
    tag: "默认",
    permission: 1,
    lastUpdate: "2023-08-07",
    count: 16,
    subscribe: 0,
    updateAt: "2023-08-07",
  },
  {
    id: "6845243268729405000",
    name: "React",
    desc: "",
    permission: 0,
    lastUpdate: "2023-07-26",
    count: 5,
    subscribe: 0,
    updateAt: "2023-07-26",
  },
  {
    id: "6845243299599483000",
    name: "工程化",
    desc: "",
    permission: 0,
    lastUpdate: "2023-06-15",
    count: 12,
    subscribe: 0,
    updateAt: "2023-06-15",
  },
  {
    id: "6845244224070402000",
    name: "浏览器",
    desc: "",
    permission: 0,
    lastUpdate: "2023-05-05",
    count: 15,
    subscribe: 0,
    updateAt: "2023-05-05",
  },
  {
    id: "7201385593069109000",
    name: "nodejs",
    desc: "",
    permission: 0,
    lastUpdate: "2023-05-04",
    count: 1,
    subscribe: 0,
    updateAt: "2023-05-04",
  },
  {
    id: "7077738435733094000",
    name: "Ts",
    desc: "",
    permission: 0,
    lastUpdate: "2023-01-17",
    count: 4,
    subscribe: 0,
    updateAt: "2023-01-17",
  },
  {
    id: "6845243977092841000",
    name: "工具",
    desc: "",
    permission: 0,
    lastUpdate: "2021-11-26",
    count: 8,
    subscribe: 0,
    updateAt: "2021-11-26",
  },
  {
    id: "6845243307346362000",
    name: "后端",
    desc: "",
    permission: 0,
    lastUpdate: "2021-07-14",
    count: 6,
    subscribe: 0,
    updateAt: "2021-07-14",
  },
  {
    id: "6845243299574350000",
    name: "Vue",
    desc: "",
    permission: 0,
    lastUpdate: "2021-07-12",
    count: 13,
    subscribe: 0,
    updateAt: "2021-07-12",
  },
  {
    id: "6845244202977067000",
    name: "CSS",
    desc: "",
    permission: 0,
    lastUpdate: "2021-04-26",
    count: 4,
    subscribe: 0,
    updateAt: "2021-04-26",
  },
];

function appendDom() {
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = `
  .${LOCAL_STORAGE_KEY}-container {
    position: fixed;
    top: 26rem;
    right: 0px;
    width: max-content;
    height: 40rem;
    z-index: 999;
    transform: translateX(100%);
    transition: transform .24s linear;
  }
  .${LOCAL_STORAGE_KEY}-list {
    box-sizing: border-box;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,.15);
    width: 100%;
    height: 100%;
    padding: 12px 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: flex-start;
    gap: 24px;
    background-color: #fff;
    overflow-y: auto;
  }
  .${LOCAL_STORAGE_KEY}-li {
    background-color: #f2f3f5;
    padding: 12px;
    border-radius: 8px;
  }
  .${LOCAL_STORAGE_KEY}-button {
    position: absolute;
    left: -2rem;
    top: 4px;
    transform: translate(-100%, 0);
    padding: 0;
    width: 3.33rem;
    height: 3.33rem;
    background-color: var(--juejin-popup);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(50,50,50,.04);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid rgba(50,50,50,.04);
    font-size: 1rem;
    color: #007fff;
    letter-spacing: 2px;
  }
  .${LOCAL_STORAGE_KEY}-input {
    margin-bottom: 6px;
    box-sizing: content-box;
    width: 320px;
    height: 18px;
    padding: 5px 10px;
    box-shadow: none;
    outline: none;
    font-size: 14px;
    transition: height .24s;
    border: 1px solid #c2c8d1;
    background-color: #fff;
    border-color: #f2f3f5;
    border-radius: 4px;
    color: #515767;
  }
  .${LOCAL_STORAGE_KEY}-input:focus {
    background: #fff;
    border-color: #1e80ff;
    box-shadow: none;
  }
  .${LOCAL_STORAGE_KEY}-input-desc:focus {
    height: 160px;
  }
  .${LOCAL_STORAGE_KEY}-item-radio {
    margin-bottom: 6px;
  }
  .${LOCAL_STORAGE_KEY}-item-info {
    display: inline-block;
    margin-left: 6px;
    font-size: 13px;
    line-height: 22px;
    color: #8a919f
  }
  .${LOCAL_STORAGE_KEY}-item-tag {
    display: inline-block;
    margin-right: 4px;
    background: #eaf2ff;
    border-radius: 2px;
    padding: 0 6px;
    height: 20px;
    line-height: 20px;
    color: #1e80ff;
    font-size: 12px;
  }
  .${LOCAL_STORAGE_KEY}-item-delete {
    margin-left: 8px;
    color: #8a919f;
    font-size: 13px;
    cursor: pointer;
  }
  .${LOCAL_STORAGE_KEY}-item-delete:hover {
    color: #1e80ff;
  }
  .${LOCAL_STORAGE_KEY}-item-create {
    
  }
  .${LOCAL_STORAGE_KEY}-label {
    min-width: 64px;
    padding-left: 26px;
    display: inline-block;
    position: relative;
    height: 24px;
    cursor: pointer;
  }
  .${LOCAL_STORAGE_KEY}-label+.${LOCAL_STORAGE_KEY}-label {
    margin-left: 12px
  }
  .${LOCAL_STORAGE_KEY}-label>input {
    display: none;
  }
  .${LOCAL_STORAGE_KEY}-radio {
    box-sizing: content-box;
    position: absolute;
    left: 3px;
    top: 3px;
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #e6e8eb;
    border-radius: 100%;
    z-index: 1;
    transition: all .24s ease-in-out;
  }
  .${LOCAL_STORAGE_KEY}-radio::after {
    height: 4px;
    width: 4px;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: transparent;
    border-radius: 100%;
    transition: all .24s ease-in-out;
  }
  .${LOCAL_STORAGE_KEY}-label.checked .${LOCAL_STORAGE_KEY}-radio {
    background-color: #3370ff;
    border-color: #3370ff;
    width: 14px;
    height: 14px;
    top: 4px;
    left: 4px;
  }
  .${LOCAL_STORAGE_KEY}-label.checked .${LOCAL_STORAGE_KEY}-radio::after {
    background-color: #fff;
  }
  .${LOCAL_STORAGE_KEY}-label-text {
    line-height: 24px;
  }
  .${LOCAL_STORAGE_KEY}-label:hover::after {
    position: absolute;
    left: 0;
    top: 0;
    content: "";
    background: #f2f3f5;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    z-index: 0;
  }
  `;

  const container = document.createElement("div");
  container.id = LOCAL_STORAGE_KEY;
  container.className = `${LOCAL_STORAGE_KEY}-container`;

  const ul = document.createElement("ul");
  ul.className = `${LOCAL_STORAGE_KEY}-list`;
  container.appendChild(ul);
  [...data, { id: "", name: "", desc: "", tag: "", updateAt: "", count: 0, subscribe: 0, permission: 0 }].forEach(
    (item) => {
      const li = document.createElement("li");
      li.className = `${LOCAL_STORAGE_KEY}-li`;
      li.dataset["id"] = item.id;

      const name = document.createElement("input");
      name.className = `${LOCAL_STORAGE_KEY}-input ${LOCAL_STORAGE_KEY}-input-name`;
      name.placeholder = "请输入收藏集名称";
      name.value = item.name;

      const desc = document.createElement("textarea");
      desc.maxLength = 100;
      desc.rows = 2;
      desc.placeholder = "请输入收藏描述（限100字，选填）";
      desc.className = `${LOCAL_STORAGE_KEY}-input ${LOCAL_STORAGE_KEY}-input-desc`;
      desc.value = item.desc;

      const info = document.createElement("span");
      info.className = `${LOCAL_STORAGE_KEY}-item-info`;
      if (item.id) {
        info.textContent = `${item.updateAt} 更新 · ${item.count}篇文章 · ${item.subscribe}订阅`;
        if (item.tag) {
          const tag = document.createElement("span");
          tag.className = `${LOCAL_STORAGE_KEY}-item-tag`;
          tag.textContent = item.tag;
          info.prepend(tag);
        }

        const deleteBtn = document.createElement("span");
        deleteBtn.className = `${LOCAL_STORAGE_KEY}-item-delete`;
        deleteBtn.dataset["id"] = item.id;
        deleteBtn.textContent = "删除";
        info.appendChild(deleteBtn);
      } else {
        const createBtn = document.createElement('button');
        createBtn.className = `${LOCAL_STORAGE_KEY}-item-create`;
        createBtn.textContent= '新建'
        info.append(createBtn)
      }

      const checkbox = document.createElement("div");
      checkbox.className = `${LOCAL_STORAGE_KEY}-item-radio`;
      checkbox.dataset["id"] = item.id;
      checkbox.innerHTML = `
    <label class="${LOCAL_STORAGE_KEY}-label${
        item.permission === 0 ? " checked" : ""
      }" data-value="0"><span class="${LOCAL_STORAGE_KEY}-radio"></span><input type="radio"><span class="${LOCAL_STORAGE_KEY}-label-text">公开</span></label>
    <label class="${LOCAL_STORAGE_KEY}-label${
        item.permission === 1 ? " checked" : ""
      }" data-value="1"><span class="${LOCAL_STORAGE_KEY}-radio"></span><input type="radio"><span class="${LOCAL_STORAGE_KEY}-label-text">隐私</span></label>`;

      li.appendChild(name);
      li.appendChild(desc);
      li.appendChild(checkbox);
      li.appendChild(info);
      ul.appendChild(li);
    }
  );

  const span = document.createElement("span");
  span.className = `${LOCAL_STORAGE_KEY}-button`;
  span.textContent = "收藏";
  function collapse() {
    if (!container.style.transform || container.style.transform === "translateX(100%)") {
      container.style.transform = "translateX(0%)";
    } else {
      container.style.transform = "translateX(100%)";
    }
  }
  span.addEventListener("click", collapse);
  container.appendChild(span);

  // event binding
  function onClick(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    // radio
    const radios = Array.from(document.querySelectorAll(`.${LOCAL_STORAGE_KEY}-item-radio`));
    const clickLabel = radios.find((radio) => radio.contains(ev.target as HTMLElement));
    if (clickLabel) {
      const id = (clickLabel as HTMLLabelElement).dataset["id"];
      if (!id) return;
      const labels = Array.from(clickLabel.querySelectorAll("label"));
      const target = labels.find((label) => label.contains(ev.target as HTMLElement));
      const value = target?.dataset?.["value"];

      const targetData = data.find((item) => item.id === id);
      if (targetData?.permission === value) {
        return;
      }

      target?.classList.add("checked");
      labels.filter((i) => i !== target).forEach((i) => i?.classList.remove("checked"));

      if (targetData) {
        targetData.permission = (+(value ?? 0) || 0) as 0 | 1;
        updateItem({
          collection_id: targetData.id,
          collection_name: targetData.name,
          description: targetData.desc,
          permission: targetData.permission as 0 | 1,
        });
      }
    }

    // delete
    if ((ev.target as HTMLSpanElement).classList.contains(`${LOCAL_STORAGE_KEY}-item-delete`)) {
      const id = (ev.target as HTMLSpanElement).dataset["id"];
      if (id) {
        deleteItem(id);
      }
    }
  }
  ul.addEventListener("click", onClick);

  document.head.appendChild(style);
  document.body.append(container);
}

/**
 * CREATE, UPDATE
 */
async function updateItem(item: {
  collection_id: string;
  collection_name: string;
  description: string;
  permission: 0 | 1;
}) {
  const res = await fetch(`https://api.juejin.cn/interact_api/v2/collectionset/update`, {
    method: "POST",
    credentials: "include",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify(item),
  }).then((res) => res.json());

  if (res.err_no === 0) {
  } else {
    alert(res.err_msg);
  }
}

/**
 * DELETE
 */
async function deleteItem(id: string) {
  const res = await fetch(`https://api.juejin.cn/interact_api/v2/collectionset/delete`, {
    method: "POST",
    credentials: "include",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify({ collection_id: id }),
  }).then((res) => res.json());

  if (res.err_no === 0) {
    const target = document.querySelector(`.${LOCAL_STORAGE_KEY}-list .${LOCAL_STORAGE_KEY}-li[data-id="${id}"]`);
    if (target) {
      target.parentNode?.removeChild(target);
    }
    data = data.filter((item) => item.id !== id);
  } else {
    alert(res.err_msg);
  }
}
