import { Router } from "https://deno.land/x/oak/mod.ts";
import { getCharacters, queryCharacter } from "./controls.ts";

const routes = new Router();

routes
  .get("/api/v1/characters", getCharacters)
  .get("/api/v1/characters/:query", queryCharacter)
  .allowedMethods();

export { routes as router };
