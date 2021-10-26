# Puyo Nexus Database API

This program fetches the data (wiki pages) from 
[Puyo Nexus Wiki](https://puyonexus.com/wiki/). It is
unofficial and permission for further use is pending.

This API consists of two parts:
- Data serving, which can be accessed on this link:
  https://puyodb-api-deno.herokuapp.com/
- Data scraping, which I maintain and will frequently update
  through my local system, preferably daily.

Roadmap:
- [x] Characters
- [ ] Puyo Puyo Tetris 2 Skill Battle skills
- [ ] Puyo Puyo! Quest cards (?)
- [ ] Attack power table

Development roadmap:
- [x] Functioning API
- [x] API deployment
- [ ] Unit testing

## Documentation

### GET `/api/v1/characters`

Returns all the characters found in 
[this page](https://puyonexus.com/wiki/List_of_Characters).

Currently supported characters are the ones listed in:
- "Primary Protagonists and Antagonists"
- "Recurring Compile-era Characters"
- "Recurring Sega-era Characters"
- "Puyo Puyo Tetris Characters"
- "Guest Characters"

Returns 200 with the following sample output:
```json
{
  "error": 0,
  "lastUpdated":"2021-04-10T10:04:00.838Z",
  "data": [
    {
      "id":"Ally",
      "name":"Ally",
      "nameJP": {"unicode":"アリィ","latin":"Arī"},
      "gender":"Female",
      "alias":["愛莉","아리"],
      "description":"Ally is a self-proclaimed adventurer from a world that was not of other Puyo Puyo locations including Primp Town or Pwurp Island. She believes that everything can be solved by using the power of love. Her pet phrase is \"Let's fall in Love!\" .",
      "birthday":"March 5"
    },{
      "id":"Amitie",
      "name":"Amitie",
      "nameJP":{"unicode":"アミティ","latin":"Amitī"},
      "gender":"Female",
      "alias":["亞米緹","아미티"],
      "description":"Amitie is a cheerful, female citizen of Primp Town. She hopes to someday become a \"wonderful magic user.\" She appears to be naive, as she is often immature, and sometimes does not understand simple jokes or puns. Amitie is the main protagonist of the second course in Puyo Puyo Fever, and is generally accepted as the main protagonist in the Fever series",
      "birthday":"May 5"
    },
    ...
  ]
}
```

### GET `/api/v1/characters/{query}`

Returns all the characters above that matches `query`
in either its name, Kana spelling, romanization, or other names.

Returns 200 if found (using example `ekoro`) with the following output:
```json
{
  "error": 0,
  "lastUpdated":"2021-04-10T10:04:00.838Z",
  "data": [
    {
      "id":"Ecolo",
      "name":"Ecolo",
      "nameJP": {"unicode":"エコロ","latin":"Ekoro"},
      "gender":"Unknown",
      "alias":["Wanderer of Worlds","艾克羅","에쿄로"],
      "description":"Ecolo is a mysterious dark character who first appears in Puyo Puyo 7. He is an entity known as a \"space-time traveler\" and can traverse dimensions to his liking. Due to the nature of being a space-time traveler whose existence conflicts with the laws of space-time, memories of his existence are easily forgotten by most."
    },{
      "id":"Unusual_Ecolo",
      "name":"Unusual Ecolo",
      "nameJP": {
        "unicode":"かわったエコロ",
        "latin":"Kawatta Ekoro"
      },
      "gender":"Unknown",
      "alias":[],
      "description":"Unusual Ecolo is the human-like alternate form of Ecolo. He can be unlocked by buying Popoi's advice multiple times. He has the same dropset and power as Ecolo, but with different animations and voice clips."
    }
  ]
}
```

If query not found (using example `inb4`), returns 400
with the following:

```json
{
  "error": 1,
  "msg": "Cannot find character with query \"inb4\"."
}
```

