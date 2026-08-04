// Regenerate docs/SOURCES.md (the Source Register) from the dataset in index.html.
// Run from the repo root:  node tools/gen-sources.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const m = html.match(/const LEVELS[\s\S]*?\nconst REGIONS.*\n/);
if (!m) throw new Error("could not find DATA block in index.html");
eval(m[0].replace(/const /g, "var "));

// Jurisdictions researched with nothing found — maintained here, not in DATA.
const NONE_FOUND = [
  ["Ecuador", "no government BIM strategy found; industry-led BIM Forum Ecuador only ([Global BIM Network](https://globalbim.org/info-collection/bim-forum-ecuador/))"],
  ["Egypt", "no national programme found; BIM used on megaprojects by client choice"],
  ["Nigeria", "no approved national BIM policy found"],
  ["Kenya", "no mandate found"],
  ["Ghana", "no national programme found; the 2018 Building Code (GS1207) has no BIM/IFC requirement"],
  ["Ethiopia", "no national programme found"],
];

const today = new Date().toISOString().slice(0, 10);
const dim = { proc: "Public procurement", perm: "Permit approvals" };
const out = [];
out.push("# The openBIM Atlas — Source Register");
out.push("");
out.push(`Every data claim on the Atlas and where it comes from. Generated from the Atlas dataset on ${today} by \`tools/gen-sources.js\` — regenerate whenever the data changes. A copy of this document belongs in the shared project folder (Google Drive / Dropbox).`);
out.push("");
out.push('Confidence key: **high** = official decree, circular or programme page · **medium** = reputable secondary source (badge "secondary source" in the UI) · **low** = unconfirmed (badge "needs verification").');
out.push("");
out.push("## Mandate statuses by jurisdiction");
out.push("");
for (const region of ["Europe", "Asia-Pacific", "Americas", "Middle East & Africa"]) {
  out.push("### " + region);
  out.push("");
  for (const d of DATA.filter(d => d.region === region)) {
    out.push("**" + d.name + "**");
    for (const k of ["proc", "perm"]) {
      const mnd = d[k];
      let line = "- " + dim[k] + ": " + LEVELS[mnd.l] + (mnd.since ? " (since " + mnd.since + ")" : "");
      if (mnd.note) line += " — " + mnd.note;
      if (mnd.src) line += " — Source: [" + mnd.src.t + "](" + mnd.src.u + ") _(confidence: " + (mnd.src.c || "n/a") + ")_";
      else if (mnd.l > 0) line += " — _no source recorded_";
      out.push(line);
    }
    for (const e of d.eco || [])
      out.push("- Ecosystem: " + e.note + " — Source: [" + e.src.t + "](" + e.src.u + ") _(confidence: " + (e.src.c || "n/a") + ")_");
    out.push("");
  }
}
out.push("## Documented value cases");
out.push("");
for (const d of DATA.filter(d => d.cases)) for (const c of d.cases) {
  out.push("**" + d.name + " — " + c.title + "** _(" + (c.kind === "outcome" ? "project outcome metric" : "process metric") + ")_");
  out.push("- Headline: " + c.stat + " — " + c.statnote);
  for (const o of c.outcomes) out.push("- " + o);
  out.push("- Source: [" + c.src + "](" + c.url + ") _(confidence: " + (c.conf || "n/a") + ")_");
  out.push("");
}
out.push("## Searched, nothing found (July 2026)");
out.push("");
out.push("These jurisdictions were researched and no national openBIM/BIM programme or mandate was found. They are logged here rather than listed on the Atlas, so the table only carries jurisdictions with something to show:");
out.push("");
for (const [name, note] of NONE_FOUND) out.push("- **" + name + "** — " + note);
out.push("");
out.push("## Cross-cutting references");
out.push("");
out.push("- [Global openBIM Mandates — 2025 edition (buildingSMART International)](https://www.buildingsmart.org/wp-content/uploads/2025/03/IFC-Mandate_2025.pdf)");
out.push("- [buildingSMART openBIM Awards program](https://www.buildingsmart.org/openbim-awards-program/)");
out.push("- [buildingSMART Awards Yearbook 2024](https://www.buildingsmart.org/wp-content/uploads/2025/04/bSI_Awards_Yearbook_2024.pdf)");
out.push("- [Global BIM Network — country information collection](https://globalbim.org/)");
out.push("- Project deck: “Some openBIM business value and mandates examples” (SBI, shared by the team)");
out.push("");
fs.writeFileSync(path.join(root, "docs", "SOURCES.md"), out.join("\n"));
console.log("docs/SOURCES.md regenerated:", DATA.length, "jurisdictions,",
  DATA.filter(d => d.cases).length, "case countries,", NONE_FOUND.length, "none-found entries");
