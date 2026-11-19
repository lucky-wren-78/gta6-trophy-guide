# gta6-trophy-guide

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01) [![rank](https://make.fun/badge/gta6-trophy-guide-01/lucky-wren-78/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01) [![reward](https://make.fun/badge/gta6-trophy-guide-01/lucky-wren-78/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

Leonida Trophy Guide — the complete offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze. Every trophy is shown with its official name, description and grade exactly as PlayStation publishes it, plus a guide written in our own words that names its sources (Exophase — GTA VI trophy list; PSNProfiles — GTA VI trophy guide).

The tracker is a checklist whose progress is saved in the browser (localStorage) and can be exported to a JSON file and imported back. It filters by kind (story, missable, collectibles, activities, online), by grade, and by searching names; a spoiler-safe mode hides the names and descriptions of story trophies until they are earned; and a four-stage roadmap leads to the platinum, flagging the 3 missable trophies (In The Beginning…, Actions Speak Louder, Bad Luck, I Guess). There are no online trophies in the official list — the online filter says so honestly instead of inventing any. The guide works fully offline and loads nothing from the network.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. (Or serve the `app/` folder with any static server, for example `npx serve app`.)

## Layout

- `app/index.html`, `app/style.css`, `app/app.js` — the guide and tracker (no build step, no external files)
- `app/data/trophies.json` — the 55 official trophies with guides, kinds, missable flags, counts and sources
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json`
- `screenshots/` — renders of the app taken in a headless browser

Entered on [make.fun](https://make.fun/?ref=9rc8rajj&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
