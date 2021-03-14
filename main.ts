import { getAllCharacters } from "./src/scraper/extractor.ts";

const fileName = "./characters.json";
const charsFile = Deno.openSync(fileName, { write: true });

const chars = await getAllCharacters();
const time = new Date();

const result = {
  lastUpdated: time.toISOString(),
  chars,
};

const encodedResult = new TextEncoder().encode(JSON.stringify(result));
const bytesOut = charsFile.writeSync(encodedResult);

console.log(result);
console.log(`${bytesOut} bytes written to ${fileName}`);
