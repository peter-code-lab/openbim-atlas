# openBIM Atlas — working mockup

An interactive mockup for the openBIM data project: a bordered world map (choropleth)
of **openBIM mandates**, overlaid with **documented business-value evidence**, and a
panel that counts the correlation between the two.

**Open `index.html` in any browser.** No build step, no dependencies, no network calls.

## The story the page tells (in order)

1. **Policy — where is openBIM required?** Two different kinds of mandate, switchable
   as map layers:
   - *Public procurement* — government as **client** requires openBIM/IFC deliverables
     (e.g. Denmark ICT Regs 118/119, Korea PPS, Québec SQI thresholds).
   - *Permit approvals* — government as **regulator** requires IFC for building-permit
     submission/code checking (e.g. Finland 2025 decree, Singapore CORENET-X, Dubai 2024,
     Japan MLIT trials).
   Status levels: Required · Partial/phasing in · Voluntary/guidelines · None tracked.
2. **Practice — what does openBIM deliver?** Documented project outcomes from
   buildingSMART Awards case studies (orange markers): Norway (−95% drawings),
   Denmark M5 Metro (−50% carbon), Hong Kong The Henderson (−30% timeline),
   Bogotá Metro (+80% quantity accuracy), etc.
3. **The link.** "Documented value cases by mandate status": 6 of 8 cases sit in
   jurisdictions where openBIM is required. That relationship — not the country
   list — is the differentiator versus existing mandate trackers.

## Features

- Real country borders (world-atlas / Natural Earth 110m, pre-projected and embedded;
  Singapore and Hong Kong drawn as dots — too small for 110m polygons).
- Region chips **zoom the map** (animated viewBox).
- Hover tooltips (both mandate dimensions at once), click-through detail cards
  with mandate notes and case outcomes.
- Live-computed stat tiles and correlation bar; case-study cards linked to the map.
- Full table view (also the accessibility fallback), light + dark themes.

## Data status — read this

Prototype data. Mandate statuses and case outcomes are summarised from the project
deck ("Some openBIM business value and mandates examples"), buildingSMART Global IFC
Mandates (2024 edition), Strategic Building Innovation studies, and public programme
announcements — **not yet independently verified or dated to a common reference
point**. Countries without colour have no programme *tracked yet*; absence of colour
is absence of research, not proof of absence. Before external use, each claim needs a
source link and an as-of date.

## Structure

- `index.html` — the whole app. Three blocks: embedded country paths (`WORLD`),
  the dataset (`DATA` — one object per jurisdiction with `proc`, `perm`, `cases`),
  and vanilla-JS rendering. Editing `DATA` re-derives everything.
- `tools/build-paths.js` — regenerates the embedded geometry from
  `world-atlas` (npm) if the projection or resolution ever changes.

## Next steps (proposed)

1. Source + as-of date fields per mandate claim; review levels with the team.
2. More value cases (bSI Awards archive is deep) and a per-case metric taxonomy
   (time / cost / carbon / quality) so the correlation can be cut by benefit type.
3. Mandate-age view: years since first mandate vs volume of documented value.
4. Move `DATA` to JSON/CSV once the schema settles.
