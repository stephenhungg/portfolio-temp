import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ reducedMotion: "no-preference" });
  const page = await context.newPage();
  const pageErrors = [];
  const failedResponses = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push({ status: response.status(), url: response.url() });
    }
  });

  await page.addInitScript(() => {
    sessionStorage.removeItem("stpn-loader-shown");
  });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  const loader = page.locator("div.fixed.inset-0.z-\\[200\\]");
  await loader.waitFor({ state: "visible", timeout: 3_000 });
  const startedAt = Date.now();

  const sample = async () =>
    loader.evaluate((root) => {
      const text = root.children[0]?.firstElementChild;
      const image = root.children[1]?.firstElementChild;
      if (!(text instanceof HTMLElement) || !(image instanceof HTMLElement)) {
        throw new Error("loader structure no longer matches the reference");
      }

      const yPercent = (element) => {
        const matrix = new DOMMatrix(getComputedStyle(element).transform);
        return (matrix.m42 / element.offsetHeight) * 100;
      };

      return {
        count: Number(text.lastElementChild?.textContent ?? "-1"),
        textY: yPercent(text),
        imageY: yPercent(image),
        opacity: Number(getComputedStyle(root).opacity),
      };
    });

  const waitUntil = async (elapsedMs) => {
    const remaining = elapsedMs - (Date.now() - startedAt);
    if (remaining > 0) await page.waitForTimeout(remaining);
  };

  await waitUntil(1_700);
  const entered = await sample();
  if (Math.abs(entered.textY) > 2 || Math.abs(entered.imageY) > 2) {
    throw new Error(`reference entrance timing drifted: ${JSON.stringify(entered)}`);
  }

  await waitUntil(3_350);
  const counted = await sample();
  if (counted.count !== 100) {
    throw new Error(`reference counter timing drifted: ${JSON.stringify(counted)}`);
  }

  await waitUntil(5_500);
  const holding = await sample();
  if (holding.textY > -95 || holding.imageY > -95 || holding.opacity < 0.98) {
    throw new Error(`reference exit/hold timing drifted: ${JSON.stringify(holding)}`);
  }

  await loader.waitFor({ state: "detached", timeout: 2_000 });
  const totalMs = Date.now() - startedAt;
  // Dev hydration can start the effect a few hundred milliseconds after the
  // overlay mounts. The GSAP sequence itself is 6.372s in the reference build.
  if (totalMs < 6_100 || totalMs > 7_200) {
    throw new Error(`reference total duration drifted: ${totalMs}ms`);
  }
  const unexpectedFailures = failedResponses.filter(({ url }) => {
    const requestUrl = new URL(url);
    return (
      !requestUrl.pathname.startsWith("/_vercel/") &&
      !(requestUrl.pathname === "/resume.pdf" && requestUrl.searchParams.has("_rsc"))
    );
  });
  if (pageErrors.length > 0 || unexpectedFailures.length > 0) {
    throw new Error(
      `runtime errors: ${JSON.stringify({ pageErrors, unexpectedFailures })}`,
    );
  }

  console.log(
    JSON.stringify({
      status: "pass",
      totalMs,
      entered,
      counted,
      holding,
      ignoredKnownFailures: failedResponses.length - unexpectedFailures.length,
    }),
  );
} finally {
  await browser.close();
}
