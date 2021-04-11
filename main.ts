import { Application } from "https://deno.land/x/oak/mod.ts";
import { router } from "./src/server/routes.ts";
import { getAllCharacters } from "./src/scraper/extractor.ts";
import { readCharacters, writeCharacters } from "./src/scraper/datamgr.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

// const chars = await getAllCharacters();

// writeCharacters(chars);
const env = Deno.env.toObject();
const argPort = parse(Deno.args).port;
const port = argPort ? Number(argPort) : 8000;
const hostname = env.HOST || "localhost";

const app = new Application();

app.use(router.routes());

console.log(`Server is running at ${hostname}:${port}`);

await app.listen({ port, hostname });
