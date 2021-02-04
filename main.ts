import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

// root link
const baseUrl = "https://puyonexus.com";

// start point
const startUrl = "/wiki/List_of_Characters";
const headerIds = [
  "Primary_Protagonists_and_Antagonists",
  "Recurring_Compile-era_Characters",
  "Recurring_Sega-era_Characters",
  "Puyo_Puyo_Tetris_Characters",
  "Guest_Characters",
];

try {
  const url = baseUrl + startUrl;
  const res = await fetch(url);
  const page = await res.text();
  const pageModel = new DOMParser().parseFromString(page, "text/html");

  const nextLinks: string[] = [];
  headerIds.forEach((id) => {
    const tap = pageModel?.querySelector("#" + id)?.parentElement
      ?.nextElementSibling;

    console.log(tap?.nodeName);

    // if (tap && tap.nodeName === "DIV") tap = tap.firstChild;

    if (tap) {
      const hrefs = tap.getElementsByTagName("a") ?? [];
      for (const h in hrefs) {
        if (Object.prototype.hasOwnProperty.call(hrefs, h)) {
          const element = hrefs[h];
          const l = element.getAttribute("href");
          l && nextLinks.push(l);
        }
      }
    }
  });

  // const tap = pageModel?.querySelector("#Primary_Protagonists_and_Antagonists")
  //   ?.parentElement?.nextElementSibling;

  // console.log(tap?.nodeName);

  // // if (tap && tap.nodeName === "DIV") tap = tap.firstChild;

  // if (tap) {
  //   const hrefs = tap.getElementsByTagName("a") ?? [];
  //   for (const h in hrefs) {
  //     if (Object.prototype.hasOwnProperty.call(hrefs, h)) {
  //       const element = hrefs[h];
  //       const l = element.getAttribute("href");
  //       l && nextLinks.push(l);
  //     }
  //   }
  // }

  console.log(nextLinks);
  // const lists = pageModel?.querySelectorAll("#mw-content-text ul") ?? [];
  // for (const list of lists) {
  //   console.log(
  //     list.parentElement?.id,
  //     list.parentElement?.className,
  //     list.previousSibling?.nodeName
  //   );
  //   if (
  //     list.parentElement?.classList.contains("div-col") ||
  //     (list.parentElement?.id === "mw-content-text" &&
  //       list.previousSibling?.nodeName === "H2")
  //   ) {
  //     // code
  //     console.log("Hit!");
  //   } else {
  //     console.log("Miss!");
  //   }
  // }

  // console.log(pageTitle);
} catch (error) {
  console.error(error);
}
