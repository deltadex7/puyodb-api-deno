import { Character } from "../model/character.ts";
import { FILE_CHARACTERS } from "../consts.ts";
import { UpdatedData } from "../server/database.ts";

export function readCharacters(): UpdatedData<Character[]> {
  // TODO: handle when the file doesn't exist

  try {
    const charsData = Deno.readTextFileSync(FILE_CHARACTERS);
    console.log(`${charsData.length} bytes read from ${FILE_CHARACTERS}.`);

    const chars: UpdatedData<Character[]> = JSON.parse(charsData);

    return chars;
  } catch (e) {
    console.log(`${FILE_CHARACTERS} does not exist. Returning a dummy data.`);
    return {
      lastUpdated: "1970-01-01T00:00:00.000Z",
      data: [],
    };
  }
}

export function writeCharacters(chars: UpdatedData<Character[]>) {
  // Pretty print with 2 spaces
  const charsData = JSON.stringify(chars, null, 2);
  Deno.writeTextFileSync(FILE_CHARACTERS, charsData);

  console.log(
    `${charsData.length} bytes written to ${FILE_CHARACTERS}.`,
  );
}
