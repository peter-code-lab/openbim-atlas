# openBIM Atlas — Data Entry Guide

How to add or update jurisdictions and value cases. No build step is needed:
all data lives in one JavaScript array (`DATA`) inside `index.html`. Edit it,
save, refresh the browser — the map, tooltips, detail cards, correlation
panel, stat tiles and table all re-derive automatically.

> A copy of this guide should live in the Dropbox project folder alongside the
> tool, per team convention.

## Where the data lives

Open `index.html` and search for `const DATA = [`. Each jurisdiction is one
object:

```js
{ iso:"DK", id:"208", name:"Denmark", region:"Europe", lat:56, lon:9.5,
  proc:{l:3, since:"2013", note:"ICT Regulations 118 & 119: BIM and IFC in state and publicly funded construction >DKK 5M",
    src:{t:"The ICT regulation — Danish Building and Property Agency", u:"https://en.bygst.dk/...", c:"high"}},
  perm:{l:0},
  cases:[{ title:"Copenhagen M5 Metro — conceptual design data validation",
    stat:"−50%", statnote:"carbon vs baseline; IFC 4.3 + bSDD + IDS",
    outcomes:["~12–14 km twin tunnel, 10 stations", "..."],
    src:"bSI openBIM Awards 2024 winner", url:"https://www.buildingsmart.org/...", conf:"high" }] }
```

## Field reference

| Field | Meaning |
|---|---|
| `iso` | ISO 3166-1 alpha-2 code (unique key) |
| `id` | ISO 3166-1 **numeric** code as a string, matching the embedded map geometry (world-atlas ids). Use `null` for jurisdictions too small to render as polygons (Singapore, Hong Kong) — they draw as dots at `lat`/`lon` instead |
| `name`, `region` | Display name; region must be one of: `Europe`, `Asia-Pacific`, `Americas`, `Middle East & Africa` |
| `lat`, `lon` | Marker anchor (approx. centroid or capital) |
| `proc` | **Public procurement** mandate — government as *client* |
| `perm` | **Permit approvals** mandate — government as *regulator* |
| `cases` | Optional array of documented value cases |

### Mandate object (`proc` / `perm`)

| Field | Meaning |
|---|---|
| `l` | Level: `3` Required (statutory/binding) · `2` Partial / phasing in (incl. major state or agency mandates, and announced mandates with a fixed date) · `1` Voluntary / guidelines · `0` None tracked |
| `since` | Year the requirement took (or takes) effect — string |
| `note` | One-line scope: who requires what, on which projects |
| `src` | Source: `t` title, `u` URL, `c` confidence — `"high"` (official decree/programme page), `"medium"` (reputable secondary source; shows a *secondary source* badge), `"low"` (unconfirmed; shows *needs verification*) |

### Case object (`cases[]`)

| Field | Meaning |
|---|---|
| `title` | Project + what was done |
| `stat` / `statnote` | The headline number and its one-line context |
| `outcomes` | 2–3 bullet outcomes shown in the detail card |
| `src` / `url` / `conf` | Source label, link, confidence (same scale as above) |

## Sourcing rules (agreed practice)

1. **Prefer primary sources**: the decree, circular, or official programme
   page. buildingSMART's *Global openBIM Mandates* report and the Global BIM
   Network collection are acceptable cross-references.
2. **Date every claim** (`since`) — mandates phase in; the year is part of the
   claim.
3. **Never leave a claim unsourced.** If only secondary reporting exists, mark
   `c:"medium"`; if unconfirmed, `c:"low"` — the UI surfaces both honestly.
4. **Level 3 vs 2 discipline**: agency-level requirements (GSA, Statsbygg,
   Senate Properties, Rijkswaterstaat, Trafikverket…) are level 2, not 3 —
   a statutory national mandate is what earns level 3.
5. `0` means *none found on research date* — record the search date in `note`.

## Adding a value case

Append to the jurisdiction's `cases` array (create it if absent). The
correlation bar, stat tiles and case cards update automatically. bSI Awards
winners/finalists announcements and yearbooks are the preferred sources:
<https://www.buildingsmart.org/openbim-awards-program/>.

## Changing the map geometry

Country shapes are pre-projected (Winkel Tripel) and embedded. To regenerate
(e.g. different resolution or projection), see `tools/build-paths.js` and
`docs/TOOL.md` — data entry never requires touching geometry.
