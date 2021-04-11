import { Character } from "../model/character.ts";
import { FILE_CHARACTERS } from "../consts.ts";
import { UpdatedData } from "../server/database.ts";

export function readCharacters(): UpdatedData<Character[]> {
  // TODO: handle when the file doesn't exist

  const charsData = Deno.readTextFileSync(FILE_CHARACTERS);
  console.log(`${charsData.length} bytes read from ${FILE_CHARACTERS}.`);

  const chars: UpdatedData<Character[]> = JSON.parse(charsData);

  return chars;
}

export function writeCharacters(chars: UpdatedData<Character[]>) {
  const charsData = JSON.stringify(chars);
  Deno.writeTextFileSync(FILE_CHARACTERS, charsData);

  console.log(
    `${charsData.length} bytes written to ${FILE_CHARACTERS}.`,
  );
}
