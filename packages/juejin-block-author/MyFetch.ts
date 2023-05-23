type MyFetchCtx = {
  method: string;
  url: string;
  body: object | string | null;
};
type IfProxyFunc = (ctx: MyFetchCtx) => boolean;
type IfProxy = string | RegExp | IfProxyFunc;
type MiddleWare = (
  ctx: MyFetchCtx,
  request: () => Promise<Response>
) => Promise<Response>;

export default class MyFetch {
  oFetch: typeof window.fetch;
  middlewareList = new Map<IfProxyFunc, MiddleWare>();

  constructor() {
    // proxy fetch
    const oFetch = (window as any).__fetch || window.fetch;
    (window as any).__fetch = oFetch;
    this.oFetch = oFetch;

    const ajax = this;
    const proxyFetch = function (
      this: any,
      ...rest: Parameters<typeof window.fetch>
    ): ReturnType<typeof window.fetch> {
      // call middlewareList
      const checkIfProxy = ajax.middlewareList.keys();

      const ctx: MyFetchCtx = {
        method: "get",
        url: "",
        body: null,
      };

      const reqUrl = rest[0];
      if (reqUrl instanceof Request) {
        ctx.method = reqUrl.method;
        ctx.url = reqUrl.url;
      } else if (reqUrl instanceof URL) {
        ctx.method = "get";
        ctx.url = reqUrl.href;
      } else {
        ctx.method = "get";
        ctx.url = reqUrl;
      }

      const requestInit = rest[1];
      if (requestInit) {
        if (requestInit.method) {
          ctx.method = requestInit.method;
        }
        if (typeof requestInit.body === "string") {
          try {
            ctx.body = JSON.parse(requestInit.body);
          } catch (error) {
            ctx.body = requestInit.body;
          }
        }
      }

      for (const ifProxy of checkIfProxy) {
        if (ifProxy(ctx)) {
          const middleware = ajax.middlewareList.get(ifProxy);
          if (middleware) {
            const request = async () => ajax.oFetch.bind(this)(...rest);
            return middleware(ctx, request);
          }
        }
      }

      return ajax.oFetch.bind(this)(...rest);
    } as typeof window.fetch;

    window.fetch = proxyFetch as typeof window.fetch;
  }

  use(ifProxy: IfProxyFunc, middleware: MiddleWare) {
    this.middlewareList.set(ifProxy, middleware);
  }
}
