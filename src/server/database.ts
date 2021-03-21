import { Character } from "../data/character.ts";
import { readCharacters, writeCharacters } from "../scraper/datamgr.ts";
import { getAllCharacters } from "../scraper/extractor.ts";

export interface UpdatedData<T> {
  lastUpdated: string;
  data: T;
}

class Database {
  _characters: UpdatedData<Character[]> = {
    lastUpdated: "1970-01-01T00:00:00.000Z",
    data: [],
  };

  constructor() {
    this.loadData();
  }

  loadData() {
    this._characters = readCharacters();
  }

  saveData() {
    writeCharacters(this._characters);
  }

  get lastUpdatedTime() {
    const nowTime = new Date();
    return nowTime.valueOf() - Date.parse(this._characters.lastUpdated);
  }

  getCharacters(): UpdatedData<Character[]> {
    return this._characters;
  }

  queryCharacter(query: string): UpdatedData<Character[]> {
    const _q = query.toLocaleLowerCase();
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

  async fetchData() {
    this._characters.data = await getAllCharacters();

    const lastUpdated = new Date().toISOString();
    this._characters.lastUpdated = lastUpdated;

    this.saveData();
  }
}

export default new Database();
