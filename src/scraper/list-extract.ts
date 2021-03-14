import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { BASE_URL, WIKI_PREFIX } from "../consts.ts";

// start point
const startUrl = WIKI_PREFIX + "List_of_Characters";
const headerIds = [
  "Primary_Protagonists_and_Antagonists",
  "Recurring_Compile-era_Characters",
  "Recurring_Sega-era_Characters",
  "Puyo_Puyo_Tetris_Characters",
  "Guest_Characters",
];

export async function getAllCharacters(): Promise<string[]> {
  let chars: string[] = [];
  try {
    const url = BASE_URL + startUrl;

    console.debug(`Fetching site ${url}...`);
    const res = await fetch(url);

    console.debug("Parsing site...");
    const page = await res.text();
    const pageModel = new DOMParser().parseFromString(page, "text/html");

    const nextLinks: string[] = [];
    headerIds.forEach((id) => {
      console.debug(`Finding header ID #${id}...`);
      const tap = pageModel?.querySelector("#" + id)?.parentElement
        ?.nextElementSibling;
      if (tap) {
        console.debug(`#${id} found, extracting links...`);
        const hrefs = tap.getElementsByTagName("a") ?? [];
        for (const h in hrefs) {
          if (Object.prototype.hasOwnProperty.call(hrefs, h)) {
            const element = hrefs[h];
            const l = element.getAttribute("href");
            if (l) {
              console.debug(`Found link ${l}.`);
              nextLinks.push(l);
            }
          }
        }
      } else {
        console.debug(`#${id} not found.`);
      }
    });

    chars = nextLinks.map((val) => val.replace(WIKI_PREFIX, ""));
  } catch (error) {
    console.error(error);
  }
  return chars;
}
