# The openBIM Atlas — Where Mandates Meet Business Value

An interactive mockup for the openBIM data project: a **Winkel Tripel** world
choropleth of **openBIM mandates**, overlaid with **documented business-value
evidence**, and a panel that counts the correlation between the two. Styled to
SBI (Strategic Building Innovation) branding — green gradient headings and a
Century Gothic font stack — with a machine-validated green map ramp in both
light and dark themes.

**Open `index.html` in any browser.** No build step, no dependencies, no network calls.

Documentation (per PacTime feedback — copies belong in the Dropbox project folder):
- **`docs/DATA-GUIDE.md`** — how to input and source data (schema, levels, sourcing rules).
- **`docs/TOOL.md`** — how the tool works + AI-provenance disclosure (built with
  Claude Code; the directing prompts are documented per version).

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

## Data status

Every jurisdiction was individually researched (July 2026) and **every claim carries
its own source link** in the country card — official decrees, programme sites and
legislation where available (e.g. Italy D.M. 560/2017, Russia PP 331, Brazil Decreto
10.306/2020, Peru D.S. 289-2019-EF, Vietnam Decision 258/QĐ-TTg, Hong Kong DEVB TC(W)
18/2018, Singapore BCA CORENET-X circular, Denmark ICT Regulations via bygst.dk).
Where only secondary reporting was found, the card shows a *secondary source* badge;
two case figures (Finland's $6M estimate, Singapore's JTC percentages) are flagged
*needs verification* pending a primary document. Value cases link to the
buildingSMART openBIM Awards announcements/yearbooks (plus one Norconsult/Autodesk
case study for Norway's E39). Uncoloured countries had no programme found in this
research pass — absence of colour is absence of evidence, not proof of absence.

Research corrections worth knowing about (vs. common secondary summaries): several
"mandates" are agency-level rather than statutory (Norway Statsbygg, Finland Senate,
Netherlands RWS/RVB, US GSA), so they are classed *partial*; Spain's binding mandate
began April 2024 (Plan BIM); Denmark's current ICT regulations date to 2013; Finland's
IFC permit mandate is in force since 1 January 2026; Czechia's BIM Act bites January
2027; Russia's state-funded mandate (2022) is statutory and classed *required*.

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
