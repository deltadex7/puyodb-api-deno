import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { router } from "./src/server/routes.ts";
import { getAllCharacters } from "./src/scraper/extractor.ts";
import { readCharacters, writeCharacters } from "./src/scraper/datamgr.ts";

// const chars = await getAllCharacters();

// writeCharacters(chars);
const env = Deno.env.toObject();
const port = env.PORT ? Number(env.PORT) : 8000;
const hostname = env.HOST || "0.0.0.0";

const app = new Application();

app.use(oakCors());
app.use(router.routes());

console.log(`Server is running at ${hostname}:${port}`);

await app.listen({ port, hostname });
