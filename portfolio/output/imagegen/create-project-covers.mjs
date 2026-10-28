import sharp from 'sharp';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Original source assets: stephenhungg/skarl and stephenhungg/scalpal, main.
// This prepares static brand covers; no generated product screenshots.
const dir = new URL('./', import.meta.url);
const asset = (name) => new URL(`source-assets/${name}`, dir);
const width = 1254;
const height = 1254;
const dataUrl = async (name) => `data:font/ttf;base64,${(await fs.readFile(asset(name))).toString('base64')}`;
const serif = await dataUrl('instrument-serif.ttf');
const frame = (svg) => `<html><head><style>@font-face{font-family:Instrument;src:url('${serif}')}*{box-sizing:border-box}html,body{margin:0;width:1254px;height:1254px;overflow:hidden}svg{display:block}</style></head><body>${svg}</body></html>`;
const root = (body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="1254" height="1254" fill="${bg}"/>${body}</svg>`;

const skarlMark = `<svg x="407" y="342" width="440" height="264" viewBox="0 0 500 300" fill="#eef8e3"><rect x="100" y="0" width="100" height="100" rx="36"/><rect x="300" y="0" width="100" height="100" rx="36"/><rect x="0" y="100" width="100" height="100" rx="36"/><rect x="200" y="100" width="100" height="100" rx="36"/><rect x="400" y="100" width="100" height="100" rx="36"/><rect x="100" y="200" width="100" height="100" rx="36"/><rect x="300" y="200" width="100" height="100" rx="36"/><path d="M58,100 C85.3,100 100,85.3 100,58 L142,58 L142,100 C114.7,100 100,114.7 100,142 L58,142Z"/><path d="M158,100 C185.3,100 200,114.7 200,142 L242,142 L242,100 C214.7,100 200,85.3 200,58 L158,58Z"/><path d="M58,200 C85.3,200 100,214.7 100,242 L142,242 L142,200 C114.7,200 100,185.3 100,158 L58,158Z"/><path d="M258,200 C285.3,200 300,214.7 300,242 L342,242 L342,200 C314.7,200 300,185.3 300,158 L258,158Z"/><path d="M358,200 C385.3,200 400,185.3 400,158 L442,158 L442,200 C414.7,200 400,214.7 400,242 L358,242Z"/><path d="M358,100 C385.3,100 400,114.7 400,142 L442,142 L442,100 C414.7,100 400,85.3 400,58 L358,58Z"/></svg>`;
let contours = '';
for (let line = 0; line < 95; line++) {
  const points = [];
  for (let x = -20; x <= 1280; x += 10) {
    const z = line / 94;
    const y = 790 + line * 5.7 + Math.sin(x * 0.0045 + z * 2.4) * (52 + z * 55) + Math.sin(x * 0.009 - z * 4) * (13 + z * 12);
    points.push(`${x},${y.toFixed(2)}`);
  }
  contours += `<polyline points="${points.join(' ')}" fill="none" stroke="${line % 9 === 0 ? '#c7f18e' : '#7d8c76'}" stroke-width="${line % 9 === 0 ? 1.2 : 0.8}" opacity="${(0.16 + line / 360).toFixed(3)}"/>`;
}
const skarl = root(`<defs><radialGradient id="wash"><stop stop-color="#7d8c76" stop-opacity=".16"/><stop offset="1" stop-color="#10120e" stop-opacity="0"/></radialGradient></defs><ellipse cx="627" cy="530" rx="610" ry="520" fill="url(#wash)"/>${contours}${skarlMark}<text x="627" y="773" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="500" font-size="154" letter-spacing="-9" fill="#eef8e3">Skarl</text>`, '#10120e');
await fs.writeFile(new URL('skarl-cover.html', dir), frame(skarl));

// Raster-to-glyph treatment of Scalpal's original reaching-arm cutouts.
const left = await sharp(fileURLToPath(asset('scalpal-arm-left.webp'))).resize(650).toBuffer();
const right = await sharp(fileURLToPath(asset('scalpal-arm-right.webp'))).resize(650).toBuffer();
const raster = await sharp({create:{width,height,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
  .composite([{input:left,left:0,top:697},{input:right,left:604,top:590}])
  .raw().toBuffer({resolveWithObject:true});
let glyphs = '';
const ramp = '.:-+*%#@';
for (let y=580;y<1050;y+=8) {
  for (let x=0;x<1254;x+=6) {
    const i=(y*width+x)*4;
    const a=raster.data[i+3]/255;
    if(a<0.15) continue;
    const l=(raster.data[i]*.299+raster.data[i+1]*.587+raster.data[i+2]*.114)/255;
    const distance=Math.abs(x-627)/627;
    const opacity=(a*(.45+l*.55)*(1-distance*.42)).toFixed(2);
    glyphs+=`<text x="${x}" y="${y}" opacity="${opacity}">${ramp[Math.min(7,Math.floor(l*8))]}</text>`;
  }
}
const scalpal = root(`<defs><radialGradient id="spark"><stop stop-color="#fff" stop-opacity=".7"/><stop offset=".1" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><text x="627" y="445" text-anchor="middle" font-family="Instrument,Georgia,serif" font-size="198" letter-spacing="-6" fill="white">scalpal.</text><g font-family="monospace" font-size="8" fill="#fff">${glyphs}</g><circle cx="625" cy="806" r="65" fill="url(#spark)"/>`, '#000');
await fs.writeFile(new URL('scalpal-cover.html', dir), frame(scalpal));
console.log('prepared both original-brand covers');
