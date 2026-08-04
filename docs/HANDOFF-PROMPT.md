# Handoff prompt — paste this into the new Claude session

You are taking over an in-progress project: **"The openBIM Atlas: Where Mandates Meet
Business Value"** — an interactive world map for SBI (Strategic Building Innovation,
sbi.international) built entirely by Claude Code across versions v0.1–v0.6. Everything
lives in the GitHub repo `openbim` (previous working branch:
`claude/new-session-9h70nh` — all work is committed and pushed there). Read
`README.md`, `docs/TOOL.md`, `docs/DATA-GUIDE.md`, `docs/PROMPTS.md` (full prompt
history per version) and `docs/SOURCES.md` before changing anything.

## The one thing that matters most (emphasized repeatedly by me and the team)

This is NOT another BIM-mandate tracker. An existing site already lists mandate
status for 59 jurisdictions (likely buildingSMART's "Global openBIM Mandates" report
family; a competitor was referred to as "solebo" but never identified — ask the team
for the URL if it comes up). **Our differentiator is INTEGRATING data and SHOWING
CORRELATIONS**: where openBIM policy exists vs where documented business value
happens. Every design decision should serve that correlation story. The page title
matches our workshop submission (Proposal #2, building on bSI Summit Porto and BIM
Forum Brazil sessions): a 90-min session where participants validate outcome-oriented
KPIs against real case studies.

## What exists (all in the repo)

- **`index.html`** — the entire app, self-contained, no dependencies, no runtime
  network calls. Three blocks: embedded pre-projected country geometry (`WORLDPKG`),
  the dataset (`DATA` array), vanilla-JS rendering. Editing `DATA` re-derives
  everything (map, tooltips, detail cards, correlation panel, tiles, table).
- **Map**: Winkel Tripel projection (team's pick over Mercator/Goode's), Natural
  Earth 50m simplified via topojson-simplify quantile 0.35 (~350KB embedded), built
  by `tools/build-paths.js` (npm: world-atlas, topojson-client, topojson-simplify).
  CRITICAL: the projection function exists in BOTH `tools/build-paths.js` and
  `index.html` (`pj()`) — change both or markers/zoom break. Antimeridian rings are
  split (prevents fill streaks), sub-2px islands dropped, Antarctica dropped, lat
  clipped [−58°, 84°]. Singapore and Hong Kong render as dots (`id:null` in DATA).
  Region chips (World/Europe/Asia-Pacific/Americas/Middle East & Africa) animate the
  SVG viewBox with per-region lon/lat clamp windows.
- **SBI branding** (must match sbi.international): heading gradient
  `#b5cf4a → #4a9b47 → #2f7a3d` via background-clip:text; font stack
  `"Century Gothic", CenturyGothic, "Avant Garde", Futura, "Trebuchet MS", system-ui`
  (no webfont embedded — CSP + licensing). Mandate choropleth is a validated ordinal
  green ramp — light `#9bc154/#55993d/#1f6b33` on `#fdfdfc`, dark
  `#35753a/#62a84e/#a8d47f` on `#161815`. **Value markers are BLUE
  (`#2a78d6`/`#3987e5`), deliberately NOT orange** — orange-on-green is the classic
  red-green colorblind confusion. Both themes are hand-designed; the viewer's
  `data-theme` attribute must override OS preference both ways.
- **Data model** (full reference in `docs/DATA-GUIDE.md`): per jurisdiction —
  `proc` (public procurement, government-as-client) and `perm` (permit
  submission/approvals, government-as-regulator), each
  `{l, since, note, src:{t,u,c}}` with levels **3 Required (statutory only!) ·
  2 Partial/phasing-in (INCLUDES agency/state-level mandates — GSA, Statsbygg,
  Trafikverket, TfNSW, Québec SQI are 2, not 3) · 1 Voluntary/guidelines · 0 None
  tracked**; confidence `c`: high (official document) / medium (renders "secondary
  source" badge) / low (renders "needs verification" badge). Optional `cases[]`
  (documented value) with **`kind:"outcome"` or `"process"`** — the team says
  outcome metrics ($ saved, time, carbon) matter, process metrics (IFC object
  counts, drawing counts) are less impactful; cards sort outcome-first. Optional
  `eco[]` (openBIM ecosystem: bSI chapters, standards adoption, research).
- **Current data**: 54 jurisdictions, every claim sourced + dated; 10 "Required"
  (strongest dim): GB, FI, DK, IT, RU, SG, MY, HK, JP, KR. 8 value cases (HK The
  Henderson, Norway E39, Finland $6M, Singapore JTC, Germany smartBRIDGE, Denmark
  M5 Metro, Colombia Bogotá Metro L1, China Guiyang–Nanning) — all sit where a
  mandate is required (4) or phasing in (4); the correlation chart shows paired
  distributions (gray = share of jurisdictions per stage, blue = share of cases)
  with the reading spelled out in plain language.
- **Docs discipline (team rule, non-negotiable)**: every AI-directed change gets an
  entry in `docs/PROMPTS.md` (the AI Prompt Log — "document the code if coded, or AI
  prompts if created by other than human agents"). `docs/SOURCES.md` (Source
  Register) is GENERATED — run `node tools/gen-sources.js` after any data change,
  never hand-edit it. Both docs also get exported as .docx for the team's shared
  Google Drive folder (folder must be created by a human and shared with Eva and
  team — prior Claude had no Drive/Dropbox access; check whether this session has a
  Drive connector before saying it can't).

## Known open items / verification queue

1. Two case figures flagged "needs verification": Finland's $6M-on-$140M estimate
   (Tarmo Savolainen, bSF chairman — only an Autodesk interview located) and
   Singapore's JTC 80–90% figures (candidate: bSI Construction Industry Insight
   PDF). Find primary documents or get team confirmation.
2. Morocco: a blog-reported Ministry of Equipment circular phasing in a public-works
   BIM mandate 2025→2030 could NOT be verified officially (no circular number, no
   Bulletin Officiel, nothing in Medias24/L'Economiste; HEXABIM says no legal
   obligation exists). It is flagged unverified in the entry — do not upgrade
   Morocco without an official source. What IS verified: ONCF requires BIM on the
   LGV Kenitra–Marrakech extension; IMANOR adopted NM ISO 19650-1; buildingSMART
   Morocco is the first African bSI chapter (2022, hosted Marrakesh Summit 2024).
3. Saudi Arabia's procurement source is low-confidence — needs a better one.
4. Verification workflow proposal awaiting team decision (in `docs/DATA-GUIDE.md`):
   human sign-off logged in the Source Register, and/or a blind AI cross-check agent
   that re-researches claims and diffs against `DATA`.
5. Populate `eco[]` for more countries (bSI chapter list is in the team's deck
   "Some openBIM business value and mandates examples") and mine the bSI Awards
   archive/yearbooks for more OUTCOME-kind value cases — every case strengthens the
   correlation panel.
6. US note (from Eva, on FHWA ADCMS): most ADCMS metrics are not openBIM-related;
   only IDOT and PennDOT run IFC/openBIM projects and have no outcome metrics yet —
   already noted in the US entry; when they publish outcomes, they're the first US
   value cases.
7. Countries researched with nothing found (Ecuador, Egypt, Nigeria, Kenya, Ghana,
   Ethiopia) are deliberately NOT in `DATA` — they live in the Source Register's
   "searched, nothing found" log (team asked why empty rows were listed; answer:
   they shouldn't be). Only add a country when one dimension reaches level 1+.

## Working conventions

- Sourcing rules: prefer official decrees/programme pages; date every claim
  (`since`); never leave a claim unsourced — badge it honestly instead. When
  research contradicts a secondary summary, trust the primary document (this
  corrected Spain→Apr 2024, Denmark→2013, Finland permits→Jan 2026, Czechia BIM
  Act→2027, Russia PP 331→Required, Japan MLIT→Required FY2023).
- Source style is uniform: gray underlined hyperlink + confidence badge, identical
  in case cards, detail cards, and footer.
- QA before shipping: screenshot light AND dark AND a region zoom AND a country
  detail card (headless Chromium works; note rAF-driven zoom animation doesn't run
  in headless screenshots — force reduced-motion to test zoom end-state).
- The previous session published the page as a Claude artifact; that URL belongs to
  the old account — publish a fresh artifact from this account if a shareable link
  is needed, and keep using the repo as the source of truth.
- Commit each meaningful iteration to the designated branch with a descriptive
  message; the version label in the page header (`v0.x`) increments with each
  directed change and must match a new entry in `docs/PROMPTS.md`.
