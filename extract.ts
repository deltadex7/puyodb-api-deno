import { getAllCharacters } from "./src/scraper/extractor.ts";
import { writeCharacters, readCharacters } from "./src/scraper/datamgr.ts";
import { equal } from "https://deno.land/x/equal/mod.ts";

const data = await getAllCharacters();

if (data.length === 0) {
  console.error("ERROR: Character data is empty! Exiting with error.");
  console.log("INFO: Existing data is not changed.");
  Deno.exit(1)
}

const old_data = readCharacters();

if (equal(data, old_data.data)) {
  console.log("INFO: Data is exactly the same. Exiting normally.");
  Deno.exit(0);
} 

const r = {
  lastUpdated: new Date().toISOString(),
  data,
};
  
writeCharacters(r);

