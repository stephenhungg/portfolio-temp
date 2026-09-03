// deep diagnostic — find what's interfering with scroll
import { chromium, devices } from 'playwright';

const browser = await chromium.launch({ headless: true });

for (const [profileName, profile] of [
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['mobile', { ...devices['iPhone 13'] }],
]) {
  const ctx = await browser.newContext(profile);
  const page = await ctx.newPage();

  // log console + uncaught errors
  page.on('pageerror', e => console.log(`[${profileName}] PAGE ERR:`, e.message.slice(0, 100)));

  for (const path of ['/', '/about', '/works', '/works/lapis']) {
    console.log(`\n=== ${profileName} ${path} ===`);
    await page.goto(`https://www.stephenhung.me${path}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => sessionStorage.setItem('stpn-loader-shown', '1'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    // 1. scrollTriggers, pin instances, overlays, transforms
    const diag = await page.evaluate(() => {
      // gsap ScrollTriggers
      const ScrollTrigger = window.ScrollTrigger || window.gsap?.ScrollTrigger;
      const STs = ScrollTrigger?.getAll?.() || [];
      const pins = STs.map(st => ({
        trigger: st.trigger?.tagName + '.' + (st.trigger?.className?.toString?.().slice(0, 30) ?? ''),
        pin: !!st.pin,
        scrub: !!st.scrub,
        start: st.vars?.start,
        end: st.vars?.end,
      }));

      // anything fixed/sticky covering full viewport that could eat wheel
      const overlays = [];
      document.querySelectorAll('*').forEach(el => {
        const cs = getComputedStyle(el);
        if ((cs.position === 'fixed' || cs.position === 'sticky')) {
          const r = el.getBoundingClientRect();
          if (r.width >= window.innerWidth - 5 && r.height >= window.innerHeight - 5) {
            const z = parseInt(cs.zIndex) || 0;
            overlays.push({
              tag: el.tagName,
              cls: el.className?.toString?.().slice(0, 60),
              z,
              pe: cs.pointerEvents,
              opacity: cs.opacity,
              visibility: cs.visibility,
            });
          }
        }
      });

      // body/html transform stack (lenis applies translate)
      const html = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);

      // does Lenis exist?
      const hasLenis = !!document.documentElement.classList.toString().match(/lenis/i) ||
        !!document.body.classList.toString().match(/lenis/i) ||
        !!document.querySelector('[class*="lenis"]');

      return {
        STcount: STs.length,
        pins: pins.filter(p => p.pin || p.scrub),
        overlays,
        htmlClasses: document.documentElement.className,
        bodyClasses: document.body.className,
        htmlTransform: html.transform,
        bodyTransform: body.transform,
        htmlOverflow: html.overflow,
        bodyOverflow: body.overflow,
        htmlOverscroll: html.overscrollBehavior,
        bodyOverscroll: body.overscrollBehavior,
        scrollBehavior: html.scrollBehavior,
        hasLenis,
        viewport: { w: window.innerWidth, h: window.innerHeight },
        docH: document.documentElement.scrollHeight,
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
      };
    });
    console.log('STcount:', diag.STcount, 'pins:', diag.pins);
    if (diag.overlays.length) console.log('overlays:', diag.overlays);
    console.log('html:', { cls: diag.htmlClasses, t: diag.htmlTransform, ov: diag.htmlOverflow, os: diag.htmlOverscroll });
    console.log('body:', { cls: diag.bodyClasses, t: diag.bodyTransform, ov: diag.bodyOverflow, os: diag.bodyOverscroll });
    console.log('hasLenis:', diag.hasLenis);

    // 2. measure scroll latency: emit single wheel events, time until window.scrollY changes
    const lat = await page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 200));
      const samples = [];
      for (let i = 0; i < 5; i++) {
        const before = window.scrollY;
        const t0 = performance.now();
        window.dispatchEvent(new WheelEvent('wheel', { deltaY: 200, bubbles: true }));
        // poll for change
        for (let p = 0; p < 200; p++) {
          await new Promise(r => setTimeout(r, 5));
          if (window.scrollY > before + 1) break;
        }
        samples.push({ delta: window.scrollY - before, ms: Math.round(performance.now() - t0) });
        await new Promise(r => setTimeout(r, 800));
      }
      return samples;
    });
    console.log('wheel→scroll latency:', lat);

    // 3. burst of wheels, see if scroll caps or lags behind
    const burst = await page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 200));
      const events = [];
      const t0 = performance.now();
      // fire 20 wheel events back-to-back
      for (let i = 0; i < 20; i++) {
        window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, bubbles: true }));
      }
      // sample scroll position over the next 2 seconds
      for (let p = 0; p < 20; p++) {
        await new Promise(r => setTimeout(r, 100));
        events.push({ ms: Math.round(performance.now() - t0), y: Math.round(window.scrollY) });
      }
      return events;
    });
    console.log('burst response:', burst.slice(-10));
  }
  await ctx.close();
}
await browser.close();
