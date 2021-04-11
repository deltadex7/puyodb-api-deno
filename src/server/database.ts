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
  /** Safety measures to prevent data race:
   * Lock the characters from being accessed while
   * the data is being updated.
   */
  _lockChars = false;
  /** Check every hour if the data is a day behind.
   * If it is, fetch and update the data.
   */
  _checkInterval = setInterval(this.updateData, 3600000);

  constructor() {
    this.loadData();
    this.updateData();
  }

  /** Load data from file */
  loadData() {
    this.lockDatabase(() => {
      this._characters = readCharacters();
    });
  }

  /** Save data to file */
  saveData() {
    writeCharacters(this._characters);
  }

  /** Check if the data is one day behind */
  isOutOfDate(): boolean {
    const now = new Date();
    now.setUTCDate(now.getUTCDay() - 1);
    return (now.valueOf() >= Date.parse(this._characters.lastUpdated));
  }

  updateData() {
    if (this.isOutOfDate()) {
      console.log(
        `Database is over a day old and therefore out of date.
        Fetching data...`,
      );

      this.fetchData();
    } else {
      console.log(
        `Database is under a day old and therefore up to date.`,
      );
    }
  }

  /** Get all characters */
  getCharacters(): UpdatedData<Character[]> {
    this.waitForLock();
    return this._characters;
  }

  /** Wait for the database lock to be released. */
  waitForLock() {
    this._lockChars && console.log("Waiting for database to unlock...");
    while (this._lockChars) { /* wait and do nothing. */ }
  }

  /** Get all characters that satisfy a certain query.
   * @param query Search keyword
   */
  queryCharacter(query: string): UpdatedData<Character[]> {
    this.waitForLock();
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

  /** Fetch data from the web, serve in memory, and
   * save it to file.
   */
  fetchData() {
    this.lockDatabase(async () => {
      this._characters.data = await getAllCharacters();

      const lastUpdated = new Date().toISOString();
      this._characters.lastUpdated = lastUpdated;
    });
    this.saveData();
  }

  /** Lock the database, modify the database, and
   * release the lock when finished
   * @param func Function that modifies the database
   */
  lockDatabase(func: () => void) {
    console.log("Locking database...");
    this._lockChars = true;
    func();
    this._lockChars = false;
    console.log("Database unlocked.");
  }
}

/** A singleton instance of the database */
export default new Database();
