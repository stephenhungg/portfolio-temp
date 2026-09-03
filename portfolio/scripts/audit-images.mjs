// Image audit for www.stephenhung.me
// Reports broken images, oversized files, missing alt text, wrong format,
// aspect ratio mismatches, and missing priority on LCP candidates.
// HARD CONSTRAINT: never reads/views image content — only metadata.

import { chromium } from 'playwright';
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SITE = 'https://www.stephenhung.me';
const ROUTES = [
  '/', '/about', '/works',
  '/works/lapis', '/works/opal', '/works/darwin', '/works/bip',
  '/works/vima', '/works/iris', '/works/yolodex', '/works/opalbot',
  '/works/flow', '/works/clarifai', '/works/crakd', '/works/tenzin',
  '/contact',
];
const PUBLIC_IMAGES = path.resolve(process.cwd(), 'public/images');

// ---------- 1. Walk public/images for filesize + dimensions ----------
async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(e.name)) out.push(p);
  }
  return out;
}

async function inspectFiles() {
  const files = await walk(PUBLIC_IMAGES);
  const results = [];
  for (const f of files) {
    const stat = await fs.stat(f);
    let meta = {};
    try {
      meta = await sharp(f).metadata();
    } catch (err) {
      meta = { error: String(err) };
    }
    results.push({
      path: f.replace(process.cwd() + '/', ''),
      size: stat.size,
      width: meta.width,
      height: meta.height,
      format: meta.format,
      hasAlpha: meta.hasAlpha,
      channels: meta.channels,
    });
  }
  return results;
}

// ---------- 2. Crawl prod with playwright ----------
async function crawlProd() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const findings = {
    badResponses: [],     // 4xx/5xx images
    domImages: [],        // all <img>/next-image with attrs
    aspectMismatches: [],
    missingAlt: [],
    lcpCandidates: [],
    requestsByRoute: {},
  };

  for (const route of ROUTES) {
    const url = SITE + route;
    const reqLog = [];
    const onResponse = async (resp) => {
      try {
        const req = resp.request();
        const rt = req.resourceType();
        if (rt !== 'image') return;
        const status = resp.status();
        reqLog.push({ url: resp.url(), status });
        if (status >= 400) {
          findings.badResponses.push({ route, url: resp.url(), status });
        }
      } catch {}
    };
    page.on('response', onResponse);

    try {
      // First load: set sessionStorage to skip loader
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.evaluate(() => {
        try { sessionStorage.setItem('stpn-loader-shown', '1'); } catch {}
      });
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      // give lazy images a chance
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);

      const imgs = await page.evaluate(() => {
        const arr = Array.from(document.querySelectorAll('img'));
        return arr.map((img) => {
          const r = img.getBoundingClientRect();
          return {
            src: img.currentSrc || img.src,
            alt: img.getAttribute('alt'),
            ariaHidden: img.getAttribute('aria-hidden'),
            role: img.getAttribute('role'),
            loading: img.getAttribute('loading'),
            fetchpriority: img.getAttribute('fetchpriority'),
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            renderedWidth: Math.round(r.width),
            renderedHeight: Math.round(r.height),
            top: Math.round(r.top),
            decoding: img.getAttribute('decoding'),
          };
        });
      });

      for (const img of imgs) {
        findings.domImages.push({ route, ...img });

        // alt-text check: empty or null AND not aria-hidden/role=presentation
        const altMissing = (img.alt === null || img.alt === '') &&
                           img.ariaHidden !== 'true' &&
                           img.role !== 'presentation';
        if (altMissing && img.renderedWidth > 24 && img.renderedHeight > 24) {
          findings.missingAlt.push({ route, src: img.src, alt: img.alt });
        }

        // 0x0 image (broken) — only flag if there is a src
        if (img.src && img.naturalWidth === 0 && img.naturalHeight === 0) {
          findings.badResponses.push({ route, url: img.src, status: 'naturalSize=0x0' });
        }

        // aspect ratio
        if (img.naturalWidth > 0 && img.naturalHeight > 0 &&
            img.renderedWidth > 16 && img.renderedHeight > 16) {
          const sourceRatio = img.naturalWidth / img.naturalHeight;
          const renderedRatio = img.renderedWidth / img.renderedHeight;
          const diff = Math.abs(sourceRatio - renderedRatio) / sourceRatio;
          if (diff > 0.05) {
            findings.aspectMismatches.push({
              route, src: img.src,
              sourceRatio: sourceRatio.toFixed(3),
              renderedRatio: renderedRatio.toFixed(3),
              diffPct: (diff * 100).toFixed(1),
              rendered: `${img.renderedWidth}x${img.renderedHeight}`,
              source: `${img.naturalWidth}x${img.naturalHeight}`,
            });
          }
        }
      }

      // LCP candidate check: only on /, /about, /works
      if (['/', '/about', '/works'].includes(route)) {
        const candidates = imgs
          .filter((i) => i.top < 900 && i.renderedWidth > 100 && i.renderedHeight > 100)
          .sort((a, b) => (b.renderedWidth * b.renderedHeight) - (a.renderedWidth * a.renderedHeight));
        const top = candidates[0];
        if (top) {
          const eager = top.loading === 'eager' || top.fetchpriority === 'high';
          findings.lcpCandidates.push({
            route, src: top.src,
            rendered: `${top.renderedWidth}x${top.renderedHeight}`,
            loading: top.loading, fetchpriority: top.fetchpriority,
            isPriority: eager,
          });
        }
      }

      findings.requestsByRoute[route] = reqLog;
    } catch (err) {
      findings.badResponses.push({ route, url, status: `nav-error: ${err.message}` });
    } finally {
      page.off('response', onResponse);
    }
  }

  await browser.close();
  return findings;
}

// ---------- 3. Combine ----------
const fileMeta = await inspectFiles();
const prod = await crawlProd();

// Oversized: > 500KB or > 2400px
const oversized = fileMeta.filter((f) =>
  f.size > 500 * 1024 || (f.width && f.width > 2400) || (f.height && f.height > 2400)
);

// Wrong format: PNG > 100KB without transparency
const wrongFormat = fileMeta.filter((f) =>
  f.format === 'png' && f.size > 100 * 1024 && !f.hasAlpha
);

// Totals
const totalBytes = fileMeta.reduce((acc, f) => acc + f.size, 0);
const biggest5 = [...fileMeta].sort((a, b) => b.size - a.size).slice(0, 5);

const report = {
  totals: {
    fileCount: fileMeta.length,
    totalBytes,
    totalMB: (totalBytes / 1024 / 1024).toFixed(2),
  },
  biggest5,
  oversized,
  wrongFormat,
  prod: {
    badResponses: prod.badResponses,
    missingAlt: prod.missingAlt,
    aspectMismatches: prod.aspectMismatches,
    lcpCandidates: prod.lcpCandidates,
  },
};

await fs.writeFile('scripts/.audit-images-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
