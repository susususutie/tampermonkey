const NAMESPACE = "juejin-auto-check";
const LOCALSTORAGE_KEY = "tampermonkey-" + NAMESPACE;

function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createIframe(id: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.id = id;
  iframe.style.position = "fixed";
  iframe.style.top = "120px";
  iframe.style.right = "24px";
  iframe.style.width = "375px";
  iframe.style.height = "850px";
  iframe.style.zIndex = "1000";
  iframe.src = "https://juejin.cn/user/center/signin";
  return iframe;
}
function removeIframe(id: string) {
  const ifrm = document.getElementById(id) as HTMLIFrameElement | null;
  if (ifrm) {
    document.body.removeChild(ifrm);
  }
}

function signin() {
  const id = `iframe-${Math.ceil(Math.random() * 100)}`;
  const iframe = createIframe(id);
  document.body.prepend(iframe);

  iframe.onload = () => {
    const dialog = document.getElementById(id) as HTMLIFrameElement | null;
    if (dialog && dialog.contentDocument) {
      const btn =
        dialog.contentDocument.querySelector<HTMLButtonElement>(".signin.btn");
      if (btn) {
        btn.click();
      }
      const timer = setTimeout(() => {
        clearTimeout(timer);
        removeIframe(id);
      }, 1000);
    }
  };
}

function main() {
  const lastestDay = localStorage.getItem(LOCALSTORAGE_KEY);
  const today = getDate();
  if (!lastestDay || lastestDay !== today) {
    try {
      signin();
      localStorage.setItem(LOCALSTORAGE_KEY, today);
    } catch (error) {
      localStorage.removeItem(LOCALSTORAGE_KEY);
    }
  }
}

function callInChrome(fn: () => void, version: number): void {
  const match = navigator.userAgent.match(/Chrome\/(\d+)/);

  if (match && match[1] && Number(match[1]) > version) {
    fn();
  }
}

callInChrome(main, 80);

export {};
