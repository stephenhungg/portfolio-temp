// convert source PNGs to WebP (q82) and update references in code.
// only converts PNGs without alpha (photos). preserves PNGs with transparency.
// dry-run first: `bun run scripts/convert-pngs.mjs --dry`
// commit: `bun run scripts/convert-pngs.mjs`
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const ROOT = path.resolve(import.meta.dir, '..');
const IMG_DIR = path.join(ROOT, 'public/images');
const DRY = process.argv.includes('--dry');

async function walk(dir) {
  const out = [];
  for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(full)));
    else if (ent.isFile() && ent.name.toLowerCase().endsWith('.png')) out.push(full);
  }
  return out;
}

async function getSrcDirs() {
  // search code for png references
  return ['app', 'components', 'data', 'lib'];
}

async function rewriteRefs(oldPath, newPath) {
  // oldPath/newPath are absolute. compute the public-relative form (e.g. /images/foo.webp)
  const rel = (p) => '/' + path.relative(path.join(ROOT, 'public'), p).replace(/\\/g, '/');
  const oldRef = rel(oldPath);
  const newRef = rel(newPath);
  const dirs = await getSrcDirs();
  let touched = 0;
  for (const d of dirs) {
    const abs = path.join(ROOT, d);
    const stack = [abs];
    while (stack.length) {
      const cur = stack.pop();
      let stat;
      try { stat = await fs.stat(cur); } catch { continue; }
      if (stat.isDirectory()) {
        for (const ent of await fs.readdir(cur)) stack.push(path.join(cur, ent));
      } else if (/\.(tsx?|jsx?|css|md|mdx|json)$/.test(cur)) {
        const buf = await fs.readFile(cur, 'utf8');
        if (buf.includes(oldRef)) {
          const next = buf.split(oldRef).join(newRef);
          if (!DRY) await fs.writeFile(cur, next);
          touched++;
        }
      }
    }
  }
  return touched;
}

const files = await walk(IMG_DIR);
let saved = 0, kept = 0, converted = 0;

for (const file of files) {
  const meta = await sharp(file).metadata();
  const stat = await fs.stat(file);
  // skip if has alpha — could be a logo/icon needing transparency
  if (meta.hasAlpha) {
    kept++;
    continue;
  }
  const newPath = file.replace(/\.png$/i, '.webp');
  if (!DRY) {
    await sharp(file).webp({ quality: 82 }).toFile(newPath);
  }
  const newStat = DRY ? { size: Math.round(stat.size * 0.18) } : await fs.stat(newPath);
  saved += stat.size - newStat.size;
  converted++;
  const refs = await rewriteRefs(file, newPath);
  console.log(`${DRY ? '[dry] ' : ''}${path.relative(ROOT, file)} ${(stat.size/1024|0)}kb → ${(newStat.size/1024|0)}kb (refs:${refs})`);
  if (!DRY) await fs.unlink(file);
}

console.log(`\nconverted: ${converted}, kept (alpha): ${kept}, saved: ${(saved/1024/1024).toFixed(2)}MB ${DRY ? '(dry-run)' : ''}`);
