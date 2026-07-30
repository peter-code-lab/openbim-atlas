# openBIM Atlas — working mockup

A first interactive mockup for the openBIM data project: a world map with two
switchable layers — **openBIM mandates** (policy) and **openBIM maturity**
(practice) — plus a correlation view that connects them.

**Open `index.html` in any browser.** No build step, no dependencies, no network
calls — everything (map, data, charts) is embedded in the one file.

## The idea

Existing trackers (e.g. the 59-jurisdiction mandate site) present mandates as a
jurisdiction-by-jurisdiction list. Our differentiator is **integration**: put
policy and adoption metrics on the same map and show the *relationship* —
"jurisdictions with a mandate in force average X points higher maturity than
those without" is a headline no list can produce.

## What the mockup shows

- **Dot-matrix world map** with jurisdiction markers (55+ jurisdictions).
- **Three layers:** Integrated (colour = mandate stage, size = maturity score),
  Mandates only, Maturity only.
- **Region filter**, hover tooltips, click-through detail cards.
- **Correlation panel:** a strip plot of maturity by mandate stage with group
  averages, and headline stat tiles (computed live from the data, so they update
  with the region filter).
- **Table view** of all underlying data (also the accessibility fallback).
- Light and dark theme, responsive.

## Data status — read this

Everything in the file is **prototype data**:

- **Mandate stages** (in force / phasing in / strategy-guidelines / none) are
  summarised from public programme announcements and are roughly right, but not
  verified or dated to a common reference point.
- **Maturity scores (0–100) are illustrative placeholders.** There is no
  methodology behind them yet — they exist to demonstrate the correlation view.

Before anything is shared externally, the dataset needs: an agreed maturity
methodology (candidate inputs: ISO 19650 adoption, buildingSMART chapter
activity/certifications, IFC usage in permitting, market surveys), a source per
claim, and an as-of date per jurisdiction.

## Structure

Single file, three blocks inside `index.html`:

1. **Geometry** — coarse hand-drawn continent outlines rendered as a dot matrix
   (deliberately stylised; no external map libraries or tiles).
2. **Data** — one JS array, one object per jurisdiction. To edit content, edit
   `DATA` and everything (map, plot, tiles, table) re-derives from it.
3. **Rendering** — vanilla JS: canvas basemap, SVG markers/plot, no frameworks.

## Next steps (proposed)

1. Agree the maturity-score methodology and data sources.
2. Move `DATA` out to a JSON/CSV file with `source` and `as_of` fields.
3. Add more correlation cuts (mandate age vs maturity; scope breadth vs maturity).
4. Then, only if it earns its keep: real country polygons for a choropleth layer.
