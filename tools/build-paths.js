// Precompute Winkel Tripel-projected SVG paths from world-atlas TopoJSON (50m).
// Output: world-paths.json  {meta:{W,H,S,X0,Y0,PHI1}, countries:[{id,name,d,bb}]}
const topojson = require("topojson-client");
const simplify = require("topojson-simplify");
const raw = require("./node_modules/world-atlas/countries-50m.json");
const pre = simplify.presimplify(raw);
const topo = simplify.simplify(pre, simplify.quantile(pre, 0.35));

const LAT0 = -58, LAT1 = 84;
const PHI1 = Math.acos(2 / Math.PI);
const D2R = Math.PI / 180;

function winkel(lonDeg, latDeg) {
  const l = lonDeg * D2R, p = Math.max(LAT0, Math.min(LAT1, latDeg)) * D2R;
  const a = Math.acos(Math.cos(p) * Math.cos(l / 2));
  const sinc = a === 0 ? 1 : Math.sin(a) / a;
  return [0.5 * (l * Math.cos(PHI1) + (2 * Math.cos(p) * Math.sin(l / 2)) / sinc),
          0.5 * (p + Math.sin(p) / sinc)];
}

// projected bounds of the clipped lon/lat domain
let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9;
for (let lon = -180; lon <= 180; lon += 1) for (const lat of [LAT0, 0, LAT1]) {
  const [x, y] = winkel(lon, lat);
  bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x);
  by0 = Math.min(by0, y); by1 = Math.max(by1, y);
}
const W = 1060;
const S = W / (bx1 - bx0);                 // scale
const H = Math.round((by1 - by0) * S);
const X0 = bx0, Y0 = by1;                  // top-left in projection space
const px = ([x, y]) => [(x - X0) * S, (Y0 - y) * S];
const r1 = v => Math.round(v * 10) / 10;

const fc = topojson.feature(topo, topo.objects.countries);
const out = [];
for (const f of fc.features) {
  if (f.id === "010") continue; // Antarctica
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = "";
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const poly of polys) {
    for (const ring of poly) {
      const pts = ring.map(([lon, lat]) => px(winkel(lon, lat)).map(r1));
      // drop sub-pixel islands: they render as specks and bloat the file
      const rx0 = Math.min(...pts.map(p => p[0])), rx1 = Math.max(...pts.map(p => p[0]));
      const ry0 = Math.min(...pts.map(p => p[1])), ry1 = Math.max(...pts.map(p => p[1]));
      if (rx1 - rx0 < 2 && ry1 - ry0 < 2 && polys.length > 1) continue;
      let first = true, prevX = null, prev = "";
      for (const [x, y] of pts) {
        const key = x + "," + y;
        // split rings that jump across the antimeridian (Russia, Fiji)
        if (first || Math.abs(x - prevX) > W / 2) d += "M" + key;
        else if (key === prev) { prevX = x; continue; }
        else d += "L" + key;
        first = false; prevX = x; prev = key;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      d += "Z";
    }
  }
  if (!d.replace(/Z/g, "").length || x0 > x1) continue;
  out.push({ id: f.id, name: f.properties.name, d, bb: [r1(x0), r1(y0), r1(x1), r1(y1)] });
}
const meta = { W, H, S: +S.toFixed(6), X0: +X0.toFixed(6), Y0: +Y0.toFixed(6), LAT0, LAT1 };
require("fs").writeFileSync("world-paths.json", JSON.stringify({ meta, countries: out }));
const ids = new Set(out.map(g => g.id));
console.log("countries:", out.length, "| bytes:", JSON.stringify({ meta, countries: out }).length,
  "| W×H:", W, "×", H, "| SG:", ids.has("702"), "HK:", ids.has("344"));
