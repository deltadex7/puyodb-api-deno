import { RouteParams, RouterContext } from "https://deno.land/x/oak/mod.ts";
import db from "./database.ts";

interface QueryParams extends RouteParams {
  query: string;
}

export function getCharacters(
  { response }: RouterContext,
) {
  response.status = 200;
  response.body = {
    error: 0,
    ...db.getCharacters(),
  };
}

export function queryCharacter(
  { params, response }: RouterContext<QueryParams>,
) {
  const queryResults = db.queryCharacter(params.query);

  if (!queryResults.data.length) {
    response.status = 400;
    response.body = {
      error: 1,
      msg: `Cannot find character with query "${params.query}".`,
    };
    return;
  }

  response.status = 200;
  response.body = { error: 0, ...queryResults };
}
