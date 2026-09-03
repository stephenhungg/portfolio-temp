import { chromium, devices } from 'playwright';
const browser = await chromium.launch({ headless: true });

const slugs = [
  'opal','darwin','bip','clarifai','vima','lapis','iris','yolodex','flow','tenzin',
  'clearpath-medical-ai','freelance-portfolio-development','vibechain-api','spotifytui',
  'replate','crakd-co','portfolio-website','instephgram','2d-world-generator',
  'ngordnet','vendi','mybackpack',
];

const results = [];
for (const profile of [
  { name: 'desktop', ctx: { viewport: { width: 1440, height: 900 } } },
  { name: 'mobile', ctx: { ...devices['iPhone 13'] } },
]) {
  const ctx = await browser.newContext(profile.ctx);
  const page = await ctx.newPage();
  for (const slug of slugs) {
    try {
      const resp = await page.goto(`https://www.stephenhung.me/works/${slug}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const status = resp?.status();
      await page.evaluate(() => sessionStorage.setItem('stpn-loader-shown','1'));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const dims = await page.evaluate(() => {
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');
        const broken = Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0).map(i => i.src);
        // find any large gap between consecutive children of main
        const gaps = [];
        if (main) {
          const kids = Array.from(main.children);
          for (let i = 0; i < kids.length - 1; i++) {
            const a = kids[i].getBoundingClientRect();
            const b = kids[i + 1].getBoundingClientRect();
            const gap = b.top - a.bottom;
            if (gap > 200) gaps.push({ idx: i, gap: Math.round(gap), aClass: kids[i].className?.toString?.().slice(0,40), bClass: kids[i+1].className?.toString?.().slice(0,40) });
          }
        }
        return {
          docH: document.documentElement.scrollHeight,
          maxScroll: document.documentElement.scrollHeight - window.innerHeight,
          mainBottom: main ? Math.round(main.getBoundingClientRect().bottom + window.scrollY) : null,
          footerTop: footer ? Math.round(footer.getBoundingClientRect().top + window.scrollY) : null,
          broken,
          gaps,
        };
      });

      const positions = [];
      for (let i = 0; i < 50; i++) {
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(50);
        positions.push(await page.evaluate(() => Math.round(window.scrollY)));
      }
      const reached = positions[positions.length - 1];
      const stuck = reached < dims.maxScroll - 50;
      const gap = (dims.footerTop ?? 0) - (dims.mainBottom ?? 0);
      const flag = stuck || gap > 50 || dims.broken.length > 0 || dims.gaps.length > 0 || status !== 200;
      console.log(`${profile.name} /${slug}: ${status} max=${dims.maxScroll} reached=${reached} gap=${gap} broken=${dims.broken.length} bigGaps=${dims.gaps.length} ${flag ? 'FLAG' : ''}`);
      if (dims.gaps.length) console.log('  gaps:', dims.gaps);
      if (dims.broken.length) console.log('  broken:', dims.broken.slice(0,3));
      results.push({ profile: profile.name, slug, status, ...dims, reached, stuck });
    } catch (e) {
      console.log(`${profile.name} /${slug}: ERROR ${e.message?.slice(0,80)}`);
    }
  }
  await ctx.close();
}
await browser.close();
import fs from 'fs';
fs.writeFileSync('/tmp/project-scroll-audit.json', JSON.stringify(results, null, 2));
