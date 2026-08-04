# openBIM Atlas — Tool Documentation

What the tool is, how it works, and how it was made. Per team practice, a copy
of this document belongs in the Dropbox project folder with the tool.

## What it is

A single self-contained HTML file (`index.html`) — no framework, no build
step, no network calls at runtime. It renders:

1. A **Winkel Tripel** world choropleth of openBIM mandate status, with two
   switchable dimensions: *public procurement* (government as client) and
   *permit approvals* (government as regulator).
2. A **value-evidence overlay**: documented case-study outcomes as blue
   markers.
3. A **correlation panel**: documented cases counted by mandate status, with
   live stat tiles.
4. Country **detail cards** with dates, scope notes and source links per
   claim, a full **table view**, region **zoom**, light/dark themes.

## Architecture (three blocks inside `index.html`)

| Block | What it does |
|---|---|
| **Geometry** (`WORLDPKG`) | Pre-projected SVG path strings per country plus projection constants (`meta`). Generated offline by `tools/build-paths.js`; embedded so the page works offline |
| **Data** (`DATA`) | One object per jurisdiction — see `docs/DATA-GUIDE.md` |
| **Rendering** (vanilla JS) | Draws countries as SVG paths, applies the level colour for the active dimension, overlays markers, drives tooltips/detail/zoom/tiles/bar/table. Everything re-renders from `DATA` on every interaction |

### Geometry pipeline (`tools/build-paths.js`)

- Source: `world-atlas` npm package (Natural Earth), 50 m resolution,
  simplified with `topojson-simplify` (quantile 0.35) so region zooms stay
  crisp at ~350 KB embedded.
- Projection: **Winkel Tripel** (chosen over Mercator — no Greenland
  inflation — and Goode's — no interruptions), standard parallel
  φ₁ = acos(2/π), latitude clipped to [−58°, 84°], Antarctica dropped.
- Rings crossing the antimeridian are split to avoid horizontal fill streaks;
  sub-2-pixel islands are dropped.
- Output `world-paths.json`: `{meta:{W,H,S,X0,Y0,LAT0,LAT1}, countries:[{id,name,d,bb}]}`.
  The page re-implements the identical projection function for marker
  placement and region-zoom windows — **if you change the projection, change
  both places**.
- Regenerate: `cd tools && npm i world-atlas topojson-client topojson-simplify && node build-paths.js`,
  then re-embed the JSON where `index.html` defines `WORLDPKG`.

### Design system

- **Brand**: SBI greens. Heading gradient `#b5cf4a → #4a9b47 → #2f7a3d`
  (CSS `background-clip: text`), Century Gothic font stack
  (`"Century Gothic", CenturyGothic, "Avant Garde", Futura, "Trebuchet MS", system-ui`) —
  Century Gothic renders where installed (Windows/Office, mac fallbacks),
  with geometric fallbacks elsewhere; no webfont is embedded.
- **Map ramp**: 3-step ordinal green ramp per theme, machine-validated
  (lightness monotone, visible step gaps, ≥2:1 light-end contrast):
  light `#9bc154 / #55993d / #1f6b33`, dark `#35753a / #62a84e / #a8d47f`.
- **Value markers**: blue (`#2a78d6` / `#3987e5`), deliberately *not* orange —
  orange-on-green is the classic red-green colour-blindness confusion pair;
  blue-on-green stays distinguishable. All markers carry a 2 px surface ring.
- Both themes are designed, not auto-inverted; the viewer's theme toggle
  (`data-theme` attribute) overrides the OS preference in both directions.
- The table view doubles as the accessibility fallback for colour-carried
  information.

## Provenance — how this tool was made (AI disclosure)

The Atlas was built by **Claude (Anthropic's AI coding agent, Claude Code)**
in a working session directed by Kyle, iterating on feedback from the SBI /
PacTime team. Per the team's documentation rule ("document the code if coded,
or AI prompts if created by other than human agents"), the directing prompts
were, in sequence:

1. **v0.1** — "Mock up a world map with an openBIM metrics layer and an
   openBIM mandates layer; differentiate from existing trackers by
   integrating data and showing correlations" (collaborator brief relayed by
   Kyle; illustrative data).
2. **v0.2** — "Use real country borders coloured in; use the information from
   the PowerPoint (*Some openBIM business value and mandates examples*);
   drop the invented maturity score; zoom into regions; explain what each
   layer and the correlation mean." Result: two mandate dimensions
   (procurement vs permits) and the bSI Awards value cases replacing the
   score.
3. **v0.3** — "Source every single country, provide primary sources, source
   the documented value, then remove the prototype-data warning." Result: a
   web-research pass over all 60 jurisdictions; every claim linked and
   confidence-flagged; statuses corrected against primary documents.
4. **v0.4** — PacTime/Janice feedback: Winkel Tripel projection (with crisper
   50 m geometry for region zooms), SBI colours and Century Gothic look,
   this documentation, and the workshop title "The openBIM Atlas: Where
   Mandates Meet Business Value".
5. **v0.5** — team review comments: hyperlinked and uniformly styled sources;
   detail cards always show the headline metric (smartBRIDGE consistency fix);
   paired-distribution correlation chart with plain-language explanation;
   outcome vs process metric categories; none-tracked jurisdictions moved to
   the Source Register's research log; shared-folder documents generated
   (`docs/SOURCES.md` → Source Register, `docs/PROMPTS.md` → AI Prompt Log,
   both also produced as .docx for Google Drive upload); verification-workflow
   proposal added to the data guide.
6. **v0.6** — Morocco deep-dive on the team's tip (buildingSMART chapter exists
   there): two research agents restored Morocco to the Atlas (ONCF LGV BIM
   requirement; unverified ministry-circular claim flagged, not repeated), and
   a new optional "openBIM ecosystem" section was added to country cards
   (chapters, standards adoption, research cases). `tools/gen-sources.js` now
   regenerates the Source Register from the dataset.

All research claims were compiled July 2026 via web search; sources and
confidence levels are embedded per claim in `DATA` and visible in the UI.
Human review of the flagged (*secondary source* / *needs verification*)
claims is the intended next step.

## Known limitations

- Singapore and Hong Kong render as dots (too small at world scale).
- Two case figures (Finland $6M estimate; Singapore JTC percentages) lack a
  located primary document and are flagged in the UI.
- "None tracked" (uncoloured) records a research outcome, not a fact about
  the jurisdiction.
- The correlation shown is descriptive (8 cases), not statistical evidence —
  the panel says exactly what it counts.
