// Precompute projected SVG paths from world-atlas 110m TopoJSON.
// Output: world-paths.json  [{id, name, d, bb:[x0,y0,x1,y1]}]
const topojson = require("topojson-client");
const topo = require("./node_modules/world-atlas/countries-110m.json");

const W = 1060;
const LAT0 = -58, LAT1 = 84;
const H = Math.round((LAT1 - LAT0) / 360 * W); // 418
const px = lon => (lon + 180) / 360 * W;
const py = lat => (LAT1 - lat) / (LAT1 - LAT0) * H;
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
      // split rings that jump across the antimeridian so the fill doesn't
      // streak horizontally across the map (Russia, Fiji)
      let first = true, prevX = null;
      for (const [lon, lat] of ring) {
        const x = r1(px(lon)), y = r1(py(Math.max(LAT0, Math.min(LAT1, lat))));
        if (first || Math.abs(x - prevX) > W / 2) { d += "M" + x + "," + y; }
        else d += "L" + x + "," + y;
        first = false; prevX = x;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      d += "Z";
    }
  }
  out.push({ id: f.id, name: f.properties.name, d, bb: [r1(x0), r1(y0), r1(x1), r1(y1)] });
}
require("fs").writeFileSync("world-paths.json", JSON.stringify(out));
console.log("countries:", out.length, "| bytes:", JSON.stringify(out).length, "| W×H:", W, "×", H);
