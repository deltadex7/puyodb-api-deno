import { Character } from "../model/character.ts";
import { readCharacters, writeCharacters } from "../scraper/datamgr.ts";
import { getAllCharacters } from "../scraper/extractor.ts";

export interface UpdatedData<T> {
  lastUpdated: string;
  data: T;
}

class Database {
  /** Data of characters */
  _characters: UpdatedData<Character[]> = {
    lastUpdated: "1970-01-01T00:00:00.000Z",
    data: [],
  };

  constructor() {
    this.loadData();
  }

  /** Load data from file */
  loadData() {
    this._characters = readCharacters();
  }

  /** Save data to file */
  saveData() {
    writeCharacters(this._characters);
  }

  /** Get all characters */
  getCharacters(): UpdatedData<Character[]> {
    return this._characters;
  }

  /** Get all characters that satisfy a certain query.
   * @param query Search keyword
   */
  queryCharacter(query: string): UpdatedData<Character[]> {
    const _q = query.toLocaleLowerCase();
    if (_q === "") return this._characters;
    return {
      lastUpdated: this._characters.lastUpdated,
      data: this._characters.data.filter(({ name, nameJP, id, alias }) =>
        id.toLocaleLowerCase().includes(_q) ||
        name.toLocaleLowerCase().includes(_q) ||
        nameJP.unicode.toLocaleLowerCase().includes(_q) ||
        nameJP.latin.toLocaleLowerCase().includes(_q) ||
        alias.some((al) => al.toLocaleLowerCase().includes(_q))
      ),
    };
  }
}

/** A singleton instance of the database */
export default new Database();
