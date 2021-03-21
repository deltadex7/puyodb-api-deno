import {
  DOMParser,
  HTMLDocument,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { BASE_URL, WIKI_PREFIX } from "../consts.ts";
import { Character } from "../data/character.ts";

// start point
const startUrl = WIKI_PREFIX + "List_of_Characters";
const headerIds = [
  "Primary_Protagonists_and_Antagonists",
  "Recurring_Compile-era_Characters",
  "Recurring_Sega-era_Characters",
  "Puyo_Puyo_Tetris_Characters",
  "Guest_Characters",
];

async function getDocumentModel(url: string): Promise<HTMLDocument> {
  try {
    console.debug(`Fetching site ${url}...`);
    const res = await fetch(url);

    console.debug("Parsing site...");
    const page = await res.text();
    const pageModel = new DOMParser().parseFromString(page, "text/html");
    if (pageModel) {
      return pageModel;
    } else {
      throw new Error(`Failed to parse ${url}.`);
    }
  } catch (error) {
    throw error;
  }
}

export async function getCharacter(wikiUrl: string): Promise<Character> {
  const _url = BASE_URL + wikiUrl;
  const character: Character = {
    id: "404",
    name: "Not found",
    nameJP: { unicode: "Not found", latin: "Not found" },
    gender: "unknown",
    alias: [],
    description: "No description provided.",
  };

  try {
    const pageModel = await getDocumentModel(_url);
    character.id = wikiUrl.replace(WIKI_PREFIX, "");

    const tableData = pageModel.querySelector("table.infobox");
    if (tableData) {
      console.debug("Extracting table data...");
      console.debug(`${tableData.nextElementSibling?.textContent}`);
      character.description = tableData.nextElementSibling?.textContent
        .replaceAll(/\s*\(.*?\)\s*/g, " ").trim() ??
        "No description provided.";
      tableData.getElementsByTagName("tr").forEach((tr, i) => {
        const tds = tr.children;
        console.debug(
          `${tds.length} | ${tds[0].textContent} | ${
            tds.length >= 2 ? JSON.stringify(tds[1].textContent) : ""
          }`,
        );
        if (i == 0) {
          character.name = tr.textContent;
          character.nameJP.latin = character.nameJP.unicode = character.name;
          return;
        }
        const label = tds[0];
        const value = tds.length >= 2 && tds[1];
        if (!value) return;
        switch (label.textContent) {
          case "Kana":
            character.nameJP.unicode = value.textContent;
            break;
          case "Romanization":
            character.nameJP.latin = value.textContent;
            break;
          case "Other Names":
            // TODO: Find an alternative to textContent that reads newlines
            // Best alternative is innerText, but HTMLElement is not yet
            // implemented in deno-dom.
            // character.alias = value.textContent
            //   .replaceAll(/\s*\(.*?\)\s*/g, "\n")
            //   .trim()
            //   .split("\n");
            console.debug(`${value.innerHTML}`);
            character.alias = value.innerHTML
              .trim()
              .split("<br>").map((line) =>
                line
                  .replaceAll(/\s*\(.*?\)\s*/g, "")
                  .replaceAll(/\s*<.*?>\s*/g, "")
              );
            break;
          case "Gender":
            character.gender = value.textContent;
            break;
          case "Birthday":
            character.birthday = value.textContent;
            break;
          case "Blood Type":
            character.bloodType = value.textContent;
            break;
          case "Age":
            character.age = Math.max(
              ...value.textContent
                .replaceAll(/\s*(\(.*?\))*\s*/g, "\n")
                .trim()
                .split("\n")
                .map((v) => parseInt(v)),
            );
            break;
          case "Height":
            character.height = parseInt(
              value.textContent.match(/\d+/g)?.shift() ?? "0",
            ) || undefined;
            break;
          case "Weight":
            character.weight = parseInt(
              value.textContent.match(/\d+/g)?.shift() ?? "0",
            ) || undefined;
            break;
          default:
            break;
        }
      });
    }
  } catch (error) {
    console.error(error);
  }

  return character;
}

async function getAllCharacterLinks(): Promise<string[]> {
  const wikiLinks: string[] = [];
  try {
    const url = BASE_URL + startUrl;

    const pageModel = await getDocumentModel(url);

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
              wikiLinks.push(l);
            }
          }
        }
      } else {
        console.debug(`#${id} not found.`);
      }
    });
  } catch (error) {
    console.error(error);
  }
  return wikiLinks;
}

export async function getAllCharacters(): Promise<Character[]> {
  return await Promise.all(
    (await getAllCharacterLinks()).map(async (url) => await getCharacter(url)),
  );
}
