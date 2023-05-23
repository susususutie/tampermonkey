import MyFetch from "./MyFetch";
import BlockAuthor from "./BlockAuthor";

const apis: string[] = [
  "https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed", // item_info
  "https://api.juejin.cn/recommend_api/v1/article/recommend_follow_feed",
  "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed",
  "https://api.juejin.cn/recommend_api/v1/article/recommend_cate_tag_feed",
];

const myFetch = new MyFetch();
const blockAuthor = new BlockAuthor();

/**
 * 1. 拦截请求
 * 2. 拦截, 返回假数据
 * 3. 代理, 获取返回值
 * 4. 代理, 修改返回值
 */
myFetch.use(
  (ctx) =>
    ctx.url.startsWith("https://api.juejin.cn/recommend_api/v1/dislike/update"),
  async (ctx, request) => {
    if (blockAuthor.ifFull()) {
      if (
        typeof ctx.body === "object" &&
        ctx.body &&
        "item_ids" in ctx.body &&
        Array.isArray(ctx.body.item_ids) &&
        ctx.body.item_ids[0]
      ) {
        blockAuthor.updateBlockedAuthor(+ctx.body.item_ids[0]);
      }
      return new Response(
        JSON.stringify({
          data: null,
          err_msg: "success",
          err_no: 0,
        }),
        { headers: {}, status: 200, statusText: "" }
      );
    }
    const res = await request();
    const [copyStream, returnStream] = res.body.tee();
    const result = await new Response(copyStream, {
      headers: res.headers,
    }).json();
    if (result && result.err_no === 3007) {
      blockAuthor.setFull(true);
      if (
        typeof ctx.body === "object" &&
        ctx.body &&
        "item_ids" in ctx.body &&
        Array.isArray(ctx.body.item_ids) &&
        ctx.body.item_ids[0]
      ) {
        blockAuthor.updateBlockedAuthor(+ctx.body.item_ids[0]);
      }
      return new Response(
        JSON.stringify({
          data: null,
          err_msg: "success",
          err_no: 0,
        }),
        { headers: res.headers, status: 200, statusText: "ok" }
      );
    }
    return new Response(returnStream, { headers: res.headers });
  }
);

myFetch.use(
  (ctx) => apis.some((api) => new RegExp(api).test(ctx.url)),
  async (ctx, request) => {
    const res = await request();
    const result = await new Response(res.body, {
      headers: res.headers,
    }).json();
    if (result && Array.isArray(result.data)) {
      const newData = blockAuthor.filter(result.data);
      console.log(result.data.length, newData.length);
      return new Response(JSON.stringify({ ...result, data: newData }), {
        headers: res.headers,
      });
    }
    return new Response(JSON.stringify(result), { headers: res.headers });
  }
);
