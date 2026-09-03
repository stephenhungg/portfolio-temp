import { chromium, devices } from 'playwright';

const PAGES = ['/', '/about', '/works', '/works/lapis', '/works/opal', '/contact'];
const BASE = 'https://www.stephenhung.me';

const detectScript = `
(() => {
  const result = {};
  const W = window.innerWidth;

  // 1. Horizontal overflow
  const overflow = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > W + 1 && r.width > 0 && r.height > 0) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed') return;
      overflow.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 80),
        id: el.id || '',
        right: Math.round(r.right),
        width: Math.round(r.width),
      });
    }
  });
  result.overflow = overflow.slice(0, 30);

  // 2. Tap targets (only run for mobile externally)
  const small = [];
  document.querySelectorAll('a, button, [role=button]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.width < 44 || r.height < 44) {
      small.push({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').trim().slice(0, 40),
        aria: el.getAttribute('aria-label') || '',
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }
  });
  result.smallTaps = small.slice(0, 30);

  // 5. Stuck ScrollReveal items: items with translateY but above viewport
  const stuck = [];
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    const t = cs.transform;
    if (!t || t === 'none') return;
    const r = el.getBoundingClientRect();
    // above viewport
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (t.includes('matrix')) {
      const m = t.match(/matrix.*\\((.+)\\)/);
      if (m) {
        const parts = m[1].split(',').map(p => parseFloat(p.trim()));
        // matrix(a,b,c,d,tx,ty) or matrix3d
        const ty = parts.length === 6 ? parts[5] : parts[13];
        if (ty && Math.abs(ty) > 5) {
          // only flag elements that have scroll-reveal indicators
          if (el.hasAttribute('data-scrollreveal') || el.hasAttribute('data-scroll') ||
              (el.className && (el.className.toString().includes('reveal') || el.className.toString().includes('scroll')))) {
            stuck.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().slice(0, 80),
              ty: Math.round(ty),
              opacity: cs.opacity,
            });
          }
        }
      }
    }
  });
  result.stuck = stuck.slice(0, 20);

  // 6. Aria/alt
  const ally = [];
  document.querySelectorAll('img').forEach(el => {
    if (!el.hasAttribute('alt')) {
      ally.push({ kind: 'img-no-alt', src: (el.src || '').slice(-60) });
    }
  });
  document.querySelectorAll('button').forEach(el => {
    const txt = (el.textContent || '').trim();
    const aria = el.getAttribute('aria-label');
    if (!txt && !aria) {
      ally.push({ kind: 'button-no-label', html: el.outerHTML.slice(0, 100) });
    }
  });
  result.ally = ally.slice(0, 20);

  // 7. Footer/main gap
  const footer = document.querySelector('footer');
  const main = document.querySelector('main');
  if (footer && main) {
    const fr = footer.getBoundingClientRect();
    const mr = main.getBoundingClientRect();
    const sy = window.scrollY;
    result.footerGap = {
      mainBottom: Math.round(mr.bottom + sy),
      footerTop: Math.round(fr.top + sy),
      gap: Math.round((fr.top + sy) - (mr.bottom + sy)),
    };
  } else {
    result.footerGap = { footer: !!footer, main: !!main };
  }

  // 8. Long text overflow (non-marquee)
  const textOver = [];
  document.querySelectorAll('p, h1, h2, h3, h4, h5, span, a, li, div').forEach(el => {
    if (el.children.length > 0) return; // only leaf-ish
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      const cs = getComputedStyle(el);
      const cls = (el.className || '').toString();
      if (cls.includes('marquee') || cls.includes('ticker') || cls.includes('scroll')) return;
      if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') return;
      const txt = (el.textContent || '').trim().slice(0, 50);
      if (!txt) return;
      textOver.push({
        tag: el.tagName.toLowerCase(),
        cls: cls.slice(0, 60),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        text: txt,
      });
    }
  });
  result.textOverflow = textOver.slice(0, 20);

  return result;
})();
`;

async function auditViewport(label, contextOpts) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext(contextOpts);
  const page = await ctx.newPage();

  const consoleMsgs = [];
  const networkErrs = [];
  const pageErrors = [];

  page.on('console', msg => {
    const t = msg.type();
    if (t === 'error' || t === 'warning') {
      consoleMsgs.push({ type: t, text: msg.text().slice(0, 200), url: page.url() });
    }
  });
  page.on('pageerror', err => {
    pageErrors.push({ msg: String(err).slice(0, 200), url: page.url() });
  });
  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkErrs.push({ status: resp.status(), url: resp.url().slice(0, 120), pageUrl: page.url() });
    }
  });

  const results = {};

  for (const path of PAGES) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.evaluate(() => sessionStorage.setItem('stpn-loader-shown', '1'));
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500);

      // scroll through page to trigger scroll reveals
      await page.evaluate(async () => {
        const h = document.documentElement.scrollHeight;
        const step = window.innerHeight / 2;
        for (let y = 0; y < h; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));
      });
      await page.waitForTimeout(500);

      // scroll to bottom and run footer-gap check
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(400);

      const data = await page.evaluate(detectScript);
      results[path] = data;
    } catch (e) {
      results[path] = { error: String(e).slice(0, 200) };
    }
  }

  await browser.close();

  return { label, results, consoleMsgs, networkErrs, pageErrors };
}

const desktop = await auditViewport('desktop', { viewport: { width: 1440, height: 900 } });
const mobile = await auditViewport('mobile', { ...devices['iPhone 13'] });

console.log(JSON.stringify({ desktop, mobile }, null, 2));
