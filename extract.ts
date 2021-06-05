import { getAllCharacters } from "./src/scraper/extractor.ts";
import { writeCharacters, readCharacters } from "./src/scraper/datamgr.ts";
import { equal } from "https://deno.land/x/equal/mod.ts";

const data = await getAllCharacters();

if (data.length === 0) {
  console.error("ERROR: Character data is empty! Exiting with error.");
  Deno.exit(1)
}

const old_data = readCharacters();

if (equal(data, old_data.data)) {
  console.error("INFO: Data is exactly the same. Exiting normally.");
  Deno.exit(0);
} 

const r = {
  lastUpdated: new Date().toISOString(),
  data: await getAllCharacters(),
};
  
writeCharacters(r);

