import { chromium, devices } from 'playwright';
import sharp from 'sharp';
const browser = await chromium.launch({ headless: true });
const iphone = devices['iPhone 13'];
const ctx = await browser.newContext({ ...iphone });
const page = await ctx.newPage();

for (const path of ['/', '/about', '/works', '/contact']) {
  await page.goto(`https://www.stephenhung.me${path}`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.setItem('stpn-loader-shown', '1'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const dims = await page.evaluate(() => ({
    docH: document.documentElement.scrollHeight,
    bodyH: document.body.scrollHeight,
    winH: window.innerHeight,
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    htmlOverflow: getComputedStyle(document.documentElement).overflow,
    bodyOverflow: getComputedStyle(document.body).overflow,
    htmlHeight: getComputedStyle(document.documentElement).height,
    bodyHeight: getComputedStyle(document.body).height,
  }));
  // try touch swipe
  const before = await page.evaluate(() => Math.round(window.scrollY));
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(80);
  }
  const after = await page.evaluate(() => Math.round(window.scrollY));
  console.log(path, 'dims:', dims, 'wheelReached:', after);
}

await browser.close();
