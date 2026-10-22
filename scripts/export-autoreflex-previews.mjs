// Run with node scripts/export-autoreflex-previews.mjs after changing a diagram.
// Export the original SVG geometry; the project page keeps its interactive HTML.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const output = new URL("public/generated/autoreflex/", root);
mkdirSync(output, { recursive: true });
const font = readFileSync(new URL("public/fonts/JetBrainsMono-Regular.woff2", root)).toString("base64");

for (const name of ["circuit", "software"]) {
  const html = readFileSync(new URL(`src/content/${name}-diagram.html`, root), "utf8");
  let svg = html.match(/<svg id="diagram"[\s\S]*?<\/svg>/)[0]
    .replace(/\sdata-(?:tooltip|desc)="[^"]*"/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const style = `<style>
    @font-face { font-family: 'JetBrains Mono'; src: url(data:font/woff2;base64,${font}) format('woff2'); }
    text { font-family: 'JetBrains Mono', monospace; }
    .data-flow { stroke-dasharray: 8 4; }
    .pulse { opacity: 0.6; }
  </style>`;
  svg = svg.replace(/(<svg[^>]*>)/, `$1\n${style}`);

  if (name === "circuit") {
    // These two overlays live outside the SVG in the interactive HTML.
    const heading = html.match(/<h1>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g, "").toUpperCase();
    const items = [...html.matchAll(/class="legend-line" style="background:([^\"]+)"[^>]*><\/div>\s*([^<]+)/g)];
    const legend = items.map(([, color, label], i) => `<path d="M 48 ${663 + i * 26} h24" stroke="${color}" stroke-width="3"/><text x="84" y="${668 + i * 26}" font-size="13" fill="#3a3a3a">${label.trim()}</text>`).join("\n");
    svg = svg.replace("</svg>", `<text x="36" y="32" font-size="17" letter-spacing="2" fill="#8a8580">${heading}</text>
      <rect x="24" y="602" width="218" height="196" rx="6" fill="#F3F2ED" stroke="#d1d9ee"/>
      <text x="48" y="636" font-size="13" letter-spacing="1.5" fill="#8a8580">WIRE LEGEND</text>
      ${legend}\n</svg>`);
  }
  writeFileSync(new URL(`${name}-diagram.svg`, output), `${svg}\n`);
  console.log(`Exported ${name} diagram`);
}
