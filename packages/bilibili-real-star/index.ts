// import { name as NAMESPACE } from "./package.json";
// const LOCALSTORAGE_KEY = "tampermonkey-" + NAMESPACE;
import "./index.css";

async function getDomContainer(): Promise<HTMLDivElement | null> {
  return new Promise((resolve) => {
    let timer = setInterval(() => {
      const domWrapper = document.querySelector<HTMLDivElement>(".b-head");
      if (domWrapper) {
        clearInterval(timer);
        resolve(domWrapper);
      }
    }, 500);
    setTimeout(() => {
      if (timer) clearInterval(timer);
      resolve(null);
    }, 10 * 1000);
  });
}

async function main() {
  const domContainer = await getDomContainer();
  if (!domContainer) return;

  // todo
}

main();

export {};
