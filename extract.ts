import { getAllCharacters } from "./src/scraper/extractor.ts";
import { writeCharacters } from "./src/scraper/datamgr.ts";

const r = {
  lastUpdated: new Date().toISOString(),
  data: await getAllCharacters(),
};

writeCharacters(r);

