# nextjs port plan

goal: rebuild the yuya framer template as a clean nextjs + tailwind + gsap codebase, deploy to stephenhung.me, retire the dom-injection mirror approach. fidelity bar is pixel-perfect, especially motion.

new app lives in `portfolio/` subfolder of this repo. existing `__mirror/yuya/site` stays as the fidelity oracle until parity is verified, then deleted.

## phase 0 — forensics & spec capture

before writing any next code we lock down what we're reproducing. this is the bedrock for "pixel-perfect motion."

- [x] motion forensics → `reference/motion-spec.md` (entrance animations catalogued; hover/scroll/marquee/page-trans deferred to phase 4 second pass)
- [x] typography extracted → `reference/typography.json` (11 type roles, Inter primary + Fragment Mono)
- [x] design tokens → `reference/tokens.json` (colors, spacing, breakpoints 810/1200, max 1600)
- [x] fonts copied → `portfolio/public/fonts/` (66 woff2 files; ultimately switched to next/font/google for Inter + Fragment Mono — local files retained as fallback)
- [ ] baseline screenshots — deferred to phase 6 (needs playwright setup)
- [ ] motion forensics second pass (hover/scroll/marquee/page-trans/text-reveal) — moved to phase 4

## phase 1 — scaffold ✓

- [x] `portfolio/` dir: **next 16.2** + app router + ts strict + tailwind v4 + bun (next 16 turbopack default)
- [x] gsap 3.15 + @gsap/react installed (ScrollTrigger/Flip/CustomEase loaded via lib/motion.ts)
- [x] mdx: @next/mdx 16.2 + remark-gfm (string form for turbopack compat) + shiki + rehype-shiki
- [x] tailwind theme tokens via `@theme` in globals.css (colors, breakpoints, container widths, font CSS vars)
- [x] fonts: next/font/google for Inter + Fragment Mono (matches what framer was serving via framerusercontent)
- [x] tsconfig strict (next default), path alias `@/*` set
- [x] root layout.tsx + globals.css with `--ease-yuya-*` and `--duration-yuya-*` css vars
- [x] mdx-components.tsx (required by next app router for mdx)
- [x] turbopack.root set to silence multi-lockfile warning
- [x] dirs: components/, lib/, content/case-studies/, data/
- [x] build passes clean (next build → static export of /)
- [ ] git: initial commit (deferred — needs gitignore audit for 85MB mirror + 87MB images first)

## phase 2 — primitives ✓

- [x] typography components: DisplayHero, DisplayLarge, DisplayMedium, Heading, HeadingSmall, Body, BodySmall, Label, Caption, Code, Eyebrow
- [x] layout primitives: Container (max 1600, 20px/30px padding), Section (40/60/80 vertical), Stack (xs–3xl gap)
- [x] motion utilities: `lib/motion.ts` registers gsap CustomEase yuyaPrimary/yuyaScale/yuyaInOut + appearProps + yuyaMotion config object
- [x] motion primitives: Appear, AppearGroup, ScrollReveal, Marquee
- [x] nav: sticky basic with mono nav links + container alignment (mobile menu deferred)
- [x] footer: socials + email + © year
- [x] mdx component map: h1–h4 → typography, p → Body, code → Code, a (internal/external split), img → next/image
- [ ] SplitText reveal — deferred until phase 4 second forensics pass confirms presence in mirror
- [ ] MagneticButton — deferred (same)

## phase 3 — content schema ✓ (modularity layer)

adding a new project = 1 entry in projects.ts + (optional) 1 mdx file. that's it.

- [x] typed `Project` interface with slug/title/year/summary/stack/tags/status/featured/hasCaseStudy/spine/links/cardImage/hero
- [x] `data/projects.ts` seeded with all 21 surviving projects from stephen-projects.json (3 dropped per ownership audit lessons)
- [x] helpers exported: featuredProjects, visibleProjects, caseStudyProjects, projectsBySlug, getProject(slug)
- [x] `content/case-studies/{opal,darwin,bip,clarifai}.mdx` written with case-study copy
- [x] `app/works/[slug]/page.tsx` dynamic route with generateStaticParams + dynamicParams=false (4 SSG case studies)
- [x] `app/works/page.tsx` featured grid + archive list reading from projects.ts

## phase 4 — pages (skeletons up; visual parity work pending)

each page must pass visual diff against mirror before moving to phase 5.

- [x] `/` home skeleton: nav, hero (Stephen/Hung in data-framer-name blocks), eyebrow, footer
- [x] `/works` skeleton: featured grid (4 case-study cards) + archive list
- [x] `/about` skeleton: bio + recently/stack/contact sections — needs photos
- [x] `/contact` skeleton: email + social links
- [x] `/works/[slug]` skeleton verified with all 4 case studies prerendered (build emits 11 static pages total)
- [x] structure forensics → `reference/page-structure.md` (per-page section ordering, container widths, layouts, key elements)
- [x] **critical fix**: layout.tsx + globals.css were silently still on Geist + create-next-app defaults — re-applied Inter/Fragment Mono fonts + yuya theme tokens (color-muted-*, tablet:/desktop: breakpoints, font-sans/mono CSS vars). build verified inter_55581303 + fragment_mono_ce9e9479 in served html
- [x] homepage hero: 12-col grid with portrait placeholder + email row + bio tagline (matches mirror layout)
- [x] homepage work section: featured 4-card grid + "view all works →" CTA
- [x] homepage about teaser: eyebrow + 2-paragraph bio + "more about me →" CTA
- [x] Nav: centered links on desktop, mobile collapses to right-aligned, "available for work" right-side badge
- [x] Footer: 3-column (contact w/ pulse status, elsewhere links, copyright) — replaces previous 2-col
- [ ] visual diff vs mirror with playwright/screenshots (phase 6 work, but worth pulling forward to validate parity)
- [x] case study `/works/[slug]` refined: metadata row (domain/year/spine/award), full-bleed hero image, sticky `about.` eyebrow, asymmetric mdx layout, stack section, similar-work 3-up grid
- [x] /works page simplified: eyebrow + year range hero, image+title-only cards (no blurb/tags), archive list with sparse text
- [x] /about: services grid (6 cards) + stack/tools wall + portrait placeholder + bio asymmetric layout + contact CTA
- [x] /contact: form with name + email + message + mailto submit, sidebar with direct/elsewhere/response-time, status pulse
- [x] visual diff infra: playwright installed in `portfolio/`, `scripts/screenshot.mjs` captures 5 routes × 2 viewports for mirror (:4177) + next (:3000) → `reference/baseline/`
- [x] **fixed ScrollReveal SSR bug**: `gsap.set + gsap.to(...scrollTrigger)` left content hidden forever in screenshots (and likely on slow loads) — refactored to IntersectionObserver + gsap.to. all sections now render. lesson captured.
- [x] homepage diff: hero + work 2x2 + about teaser + footer all rendering correctly
- [x] /works diff: eyebrow + year-range + 2x2 image-only cards + archive list rendering correctly
- [x] /works/opal diff: hero + metadata row + full-bleed hero image + asymmetric mdx + stack + similar-work 3-up rendering correctly
- [x] mobile parity check (5 routes at 390px) — services grid 2-col, stack chips wrap, hero stacks cleanly, footer 1-col, contact form full-width — all good
- [x] hover polish: nav links underline animation, project card arrow reveals on hover
- [x] legacy framer source-slug redirects: `next.config.ts` redirects() — verified `/works/stone-mind` → 308 → `/works/opal`
- [x] sitemap.ts + robots.ts (deploy essentials)
- [x] DEPLOY.md with vercel setup, domain attach, env-var process
- [x] homepage hero: bumped to ~100vh height matching framer mirror (`min-h-[calc(100vh-160px)] flex justify-center`)
- [x] homepage hero refactor v2: flex-col layout with title at top, flex-1 spacer, email/bio anchored at bottom of viewport — matches yuya hero pattern where email/bio sits near fold bottom (y=644 yuya, y=673 mine)
- [x] case study mdx prose: `.prose-yuya` styles in globals.css for h2/h3/p/ul/ol/li/strong/a/code (proper section rhythm, list markers)
- [x] perf: switched all project card `<img>` → next/image (AVIF/WebP serving + responsive srcset). `ProjectCardImage` reusable component. case-study hero image + similar-work cards also converted. priority loading on case-study hero
- [x] portfolio/vercel.json: framework + build + install commands, security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy), 1y immutable cache for `/_next/static/*`, `/fonts/*`, `/images/*`
- [x] portfolio/README.md: replaces create-next-app default — full architecture/structure/scripts/motion-specs guide
- [x] resume.pdf copied to portfolio/public/ — `/resume.pdf` link in /about now functional
- [x] OpenGraph image: `app/opengraph-image.tsx` generates 1200x630 PNG with stephen hung + project list (verified `/opengraph-image` returns 200 png)
- [x] full og + twitter card metadata added to root layout
- [x] 404 page: `app/not-found.tsx` with branded layout + recovery links to /works and /
- [ ] add stephen photos when provided (replace homepage + /about portrait placeholders)
- [ ] page transitions (view transitions API or gsap Flip) — deferred, next 16 view-transitions API not yet stable

## phase 5 — motion port

systematic gsap rebuild of every animation in `reference/motion-spec.md`.

- [x] hero entry sequence — title/portrait/email/bio cascade with proper variants per spec (y175/y265 for content blocks, scale-in for portrait feature)
- [x] scroll-linked section reveals — IntersectionObserver + gsap with yuya eases, threshold 0.15, once=true
- [x] work card hover (hover-in/out, image scale, label morph) — image 1→1.08 700ms, gradient scrim 500ms, title slide+fade 500ms
- [ ] marquee (gsap timeline, infinite) — not present in current pages, defer
- [ ] magnetic links/buttons if present — not present in yuya, skip
- [ ] page transitions via gsap Flip (shared layout morphs between routes) — defer to phase 8 polish
- [x] mobile-specific motion variants — using same variants, adapts via tailwind responsive
- [ ] verify each motion against mirror with side-by-side screen recording — phase 6 work

## phase 6 — parity verification

hard gate before deploy.

- [ ] playwright visual diff: desktop 1440x900 across 7 routes
- [ ] playwright visual diff: mobile 390x844 across 7 routes
- [ ] threshold: <2% pixel diff on initial paint, hard fail otherwise
- [ ] motion verification: record canonical animations on both, eyeball confirm
- [ ] lighthouse: perf ≥90, a11y 100, seo ≥95
- [ ] cross-browser smoke: chrome, safari, firefox

## phase 7 — deploy + cutover

- [x] DEPLOY.md written with all commands (`vercel link`, domain attach, env vars)
- [x] redirects in next.config.ts (legacy framer slugs preserved)
- [x] sitemap + robots ready
- [ ] **user step**: `cd portfolio && bunx vercel link && bunx vercel --prod`
- [ ] **user step**: attach `stephenhung.me` to production via vercel dashboard
- [ ] **user step**: dns cutover from old `portfolio-website` repo (both projects in same vercel account → swap via dashboard, no registrar change)
- [ ] verify production after deploy: 5 main routes + 4 case studies + legacy redirects + sitemap.xml + robots.txt
- [ ] audit `portfolio-website/` for any inbound paths that need redirects to the new site
- [ ] cleanup commit (after stable in prod): rm `__mirror/`, `stephen-overrides.js`, `stephen-loader.*`, `stephen-projects.json`, `stephen-site.json`, `scripts/`, root `*.html`, `_redirects`, `vercel.json`, `404.html`, `about/`, `contact/`, `works/`, `images/`, `assets/`
- [ ] tag v1.0.0

## phase 8 — optional polish (post-launch)

- [ ] og image generation
- [ ] sitemap + robots
- [ ] analytics
- [ ] github activity widget (if wanted)
- [ ] visitor count via upstash (if wanted)
- [ ] photo gallery section

## current state (loop wind-down)

site is **deploy-ready**. all 14 routes verified working:

```
/                  200    home
/works             200    works listing
/works/opal        200    case study (SSG)
/works/darwin      200    case study (SSG)
/works/bip         200    case study (SSG)
/works/clarifai    200    case study (SSG)
/about             200    about
/contact           200    contact + form
/works/stone-mind  308    legacy redirect → /works/opal (and 3 others)
/sitemap.xml       200    auto-generated from data/projects.ts
/robots.txt        200
/opengraph-image   200    1200x630 dynamic png
/resume.pdf        200    static asset
/works/nonexistent 404    branded 404 page
```

dev: `cd portfolio && bun run dev` (currently live on :3000)
build: 11 static pages emitted, no errors, no warnings

## remaining gates (need user)

- **photos**: drop into `portfolio/public/images/` (e.g. `stephen-portrait.png`) — replaces homepage hero portrait placeholder + /about portrait wall
- **deploy**: `cd portfolio && bunx vercel link && bunx vercel --prod`
- **domain**: attach `stephenhung.me` via vercel dashboard (both projects in same vercel account, no registrar change)
- **post-deploy cleanup**: rm `__mirror/`, root html files, old framer scripts (only after stable in prod)

## known risks

- **framer's motion is built on their internal runtime, a fork of framer-motion** — exact easing/spring physics may not be 1:1 in gsap. mitigation: extract bezier curves precisely in phase 0, eyeball-verify in phase 5
- **shared-layout page transitions** are framer-native magic. gsap Flip can do this but requires manual choreography. mitigation: budget extra time on phase 5 for transitions
- **fonts may be subset/licensed by framer** — check before shipping
- **typography metrics** — line-height/letter-spacing differences cause visible shifts. tokens must be precise

## responsive cursor + personal photo refresh — 2026-08-09

goal: make mouse behavior reliable across viewport and input changes, then select and integrate the strongest portfolio-appropriate photos from macOS Photos.

- [x] reproduce live cursor failures across desktop, narrow desktop, tablet, and mobile widths
- [x] inspect cursor implementation and responsive css for root cause
- [x] audit Photos read-only and shortlist strong images with varied framing
- [x] confirm the strongest selections already have web-ready exports in `portfolio/public/images/`
- [x] promote the YC photo into the home-page about section; keep the beach, OpenAI, and Yosemite shots in their complementary slots
- [x] verify live breakpoint resizing, pointer modes, build, mobile layout, image loading, and browser console
- [x] document final results and remaining caveats

review: the native cursor was hidden by a standalone media query while the custom cursor made a one-time mount decision. resizing across 810px or enabling reduced motion could therefore leave the page with no visible pointer. `Cursor.tsx` now listens to media-query changes and owns a `custom-cursor-active` root class; CSS only suppresses the native pointer while that class is present. it also resets hover/position state when the pointer leaves the document.

photo review: the strongest portfolio-ready images were already exported locally: the beach portrait for the hero, OpenAI hackathon working shot for about, YC portrait for credibility, and Yosemite portrait for personality. newer Photos face clusters were mostly casual/group images with weaker crops. the home teaser now promotes the YC image in place of the blurry night shot.

verification: `bunx tsc --noEmit` and `bun run build` pass (27/27 pages). production-like browser QA at 390px, 800px, and 900px confirmed native cursor at 390/800, custom cursor at 900, and correct live switching in both directions without reload. the promoted image loads through `next/image`, the mobile crop is clean, and the browser console has no warnings or errors.

## github-folder project card audit — 2026-05-27

goal: audit `~/Documents/GitHub` for portfolio-worthy repos missing from the nextjs + tailwind app, then add new cards without inventing full case studies.

- [x] inspect existing project data/rendering path
- [x] audit local github repos for candidate projects and metadata
- [x] add missing projects to `portfolio/data/projects.ts`
- [x] update `/works` so non-mdx projects still appear as cards
- [x] reuse available repo artwork where present
- [x] run `cd portfolio && bun run build`
- [x] document results here

result: after a first broad pass, re-audited with two subagents and kept the grid curated. added cards for `itto`, `mimi`, `angel`, `framer-runtime-mirror`, `gbrain contribution`, and `cram`. skipped older/readme-only or weaker projects (`InStephGram`, `debateAI`, `playlistify-api`, `swrlr`, `tt-creator-analytics`, `VBCV`) and avoided private/personal-memory repos (`life-wiki`, `stephen-brain`, `lifequery`) for public portfolio fit. copied polished card assets for itto/mimi/angel and converted them to webp.

verification: `cd portfolio && bun run build` passes. playwright smoke on `/works` confirmed `itto`, `mimi`, `angel`, `framer runtime mirror`, `gbrain contribution`, `cram`, plus existing `vima`, `lapis`, and `iris` are present; new card images load; no console errors. screenshot saved at `tasks/works-curated-cards.png`.

## generated card image audit — 2026-05-27

goal: audit existing project card image style and use higgsfield for missing new cards only.

- [x] audit current `*-card.webp` image dimensions/style
- [x] identify missing card images: `framer-runtime-mirror`, `gbrain-contribution`, `cram`
- [x] generate new card images with higgsfield mcp
- [x] reject/fix weak generations (`gbrain` literal brain, `cram` fake text)
- [x] normalize generated images to `1254x1254` webp
- [x] wire generated `cardImage` paths into `portfolio/data/projects.ts`
- [x] build and browser-smoke `/works`

result: added `portfolio/public/images/framer-runtime-mirror-card.webp`, `portfolio/public/images/gbrain-contribution-card.webp`, and `portfolio/public/images/cram-card.webp`. contact sheet saved at `tasks/card-image-contact-sheet.webp`.

verification: `cd portfolio && bun run build` passes. playwright smoke on `/works` confirmed all three generated card images load at `1254x1254` with no console errors. screenshot saved at `tasks/works-generated-cards.png`.

## comprehensive repo exploration — 2026-07-21

goal: build a current, evidence-backed mental model of the nextjs portfolio before making further changes.

- [x] map architecture, routes, data flow, and content model
- [x] map visual system, responsive behavior, and motion architecture
- [x] assess runtime quality, tooling, build health, and known risks
- [x] inspect git history, docs, deployment notes, and prior qa reports
- [x] synthesize findings and recommended next moves

review: three parallel read-only audits covered architecture/content, visual/motion, and runtime/quality. `bun run build` passes with 27/27 pages and production is healthy. the strongest foundation is the typed project dataset feeding listings, 13 static case studies, metadata, og images, and sitemap. priority cleanup is: track the app in git; patch dependency advisories; correct unsupported/stale claims and dead links; fix hidden nav focus, loader/reduced-motion, contrast, narrow-window cursor, and mobile carousel behavior; then remove or wire dead code, centralize duplicated content, refresh docs/scripts, and add automated smoke/a11y coverage.

## full portfolio hardening — 2026-07-21

goal: resolve the complete exploration backlog and leave the portfolio credible, accessible, maintainable, tested, and source-control ready.

- [ ] record baseline build, dependency audit, and repo state
- [ ] upgrade vulnerable direct and transitive dependencies
- [ ] centralize site identity, public profile copy, canonical url, and verified claims
- [ ] correct project awards, dates, urls, walmart status, and dead links
- [ ] make project visibility semantics explicit and contextualize related work
- [ ] fix navigation focus containment and add a skip link
- [ ] shorten/skip the loader, synchronize readiness, and honor reduced motion
- [ ] add reduced-motion handling across entrances, scroll, carousel, marquee, tilt, cursor, and faq
- [ ] fix mobile carousel sizing, narrow-window cursor, contrast, focus states, overflow, and touch behavior
- [ ] restore semantic mdx headings and fail builds on missing case-study content
- [ ] optimize or remove stale assets and avoid raw oversized images
- [ ] harden contact validation, status announcements, rate limiting, and preview behavior
- [ ] remove/wire dead transition and motion code; reduce duplicated tokens
- [ ] refresh readme, deploy docs, and maintenance scripts
- [ ] add lint, typecheck, route/content integrity, accessibility, and browser smoke coverage
- [ ] verify build, audits, responsive behavior, keyboard flow, reduced motion, and production-like runtime
- [ ] document the final review and prepare the app for its initial tracked commit

## homepage copy + deployed carousel restore — 2026-08-31

goal: update the homepage positioning copy and replace the newer five-card carousel with the carousel currently running on the deployed site.

- [x] capture the deployed carousel structure, card set, controls, and motion behavior
- [x] update the homepage headline, bio, and supporting paragraph
- [x] restore the deployed 13-card gsap loop with drag and previous/next controls
- [x] verify typecheck, production build, local copy, carousel cards, controls, and browser console
- [x] document the final result here

review: recovered the deployed carousel implementation from the live build and translated it back into maintainable source using `useGSAP`, the original seamless-loop timing, Draggable input, and reduced-motion-aware control transitions. the homepage again renders all 13 case studies in the layered center-card composition with the compact previous/next controls. all three requested copy blocks now match the supplied wording.

verification: `bunx tsc --noEmit` and `bun run build` pass, with 27/27 pages generated. browser QA confirmed 13 carousel cards, yolodex centered on load, next advancing to opal, previous returning to yolodex, exact deployed section dimensions and visual composition at 1280px, correct new copy, and zero console warnings or errors.

## footer + about profile refresh — 2026-08-31

goal: refresh availability, experience, faq, photo, and résumé content while preserving the existing visual system.

- [x] update the footer tagline and remove the availability badge
- [x] rename services to skills and refresh experience + faq copy
- [x] replace the about yc-sign gallery photo with the supplied heic portrait
- [x] replace the public résumé with the supplied may 2028 pdf
- [x] verify typecheck, build, desktop/mobile layout, image loading, pdf delivery, and browser console
- [x] document the final result here

review: the shared footer now uses the new internships/hackathons/freelance line with no availability badge. the about page now says skills, uses the supplied sunset portrait in the former yc-sign gallery slot, and carries the requested walmart, enactus, cal blueprint, theta tau, and faq wording. the public résumé is the supplied may 2028 pdf, copied byte-for-byte.

verification: `bunx tsc --noEmit` and `bun run build` pass with 27/27 pages generated. desktop browser qa confirmed the new gallery crop and all copy; 390px qa confirmed no horizontal overflow, a loaded responsive photo, the new footer line, and no availability badge. `/resume.pdf` returns `200 application/pdf`, has the expected 134,991-byte length, and matches the source sha-256. there are no browser errors; the desktop about page still reports the pre-existing next/image aspect-ratio warnings for logo-marquee svgs.

## loader pacing revert — 2026-09-03

goal: restore the intro loader to its original audited pacing instead of the compressed fast version.

- [x] recover the intended timing values from the loader motion spec
- [x] restore entrance, counter, image-cycle, exit, and overlay-fade timing
- [x] keep the global loader-ready fallback behind the full animation window
- [x] verify typecheck, production build, and first-session runtime duration
- [x] document the final result here

review: restored the loader to the timing already documented by its audited motion spec. the counter now runs for 2.946 seconds, the image cycle fills the remaining hold, the masked exit begins at 3.772 seconds, and the final overlay fade lasts 711ms. the loader-ready safety timeout now waits until after the full sequence instead of releasing hero animations behind the overlay.

verification: `bunx tsc --noEmit` and `bun run build` pass with 27/27 pages generated. a fresh playwright session measured the loader detaching 5.779 seconds after navigation (including local dev compilation/hydration), stored the once-per-session flag, and logged zero console errors. a same-session reload showed no loader and made the homepage headline visible in 105ms. production deployment `dpl_5ojP9Wa7mr6HWefJzSMgdTqTQEh5` is ready and aliased to `www.stephenhung.me`; a clean production session returned 200 and measured a 6.194-second loader window including network and hydration. production still emits the unrelated existing next-router pdf prefetch 404 for `/resume.pdf?_rsc=...`, while the direct pdf route itself returns 200.

## exact two-deployments-ago loader restore — 2026-09-03

goal: replace the inferred loader pacing with an exact behavioral match to vercel deployment `stephen-k7e55dbnz-stephen-hungs-projects-d01c13ef.vercel.app`.

- [x] capture the reference deployment frame sequence, dom states, and timing
- [x] identify the exact implementation and assets behind the reference loader
- [x] reproduce the reference behavior in the current next.js app
- [x] verify reference/current parity across timestamps and first-session gating
- [x] run typecheck + production build and deploy to vercel
- [x] verify the production alias and document the result

review: the prior fix used the current source comment as a proxy and restored only a guessed total duration. the actual source of truth was the protected immutable vercel deployment `dpl_EGVptWY7kTGyLZdHJTnraiHec8Ec`. authenticated `vercel curl` extraction recovered its compiled `Loader` module and exact gsap sequence: 276ms entrance delay; 700ms text entrance; 1.2s image entrance beginning at +400ms; 2.946s counter; 2.1s image cycle beginning at 1.1s; exit at 3.772s with a 1.2s image retreat and 700ms text retreat beginning at +700ms; then a 650ms white hold and 550ms overlay fade. the current production bundle now compiles to those same values and the same loader markup.

verification: `bunx tsc --noEmit`, `bun run build`, and the new `bun run test:loader` regression check pass. the production-mode check validated the entered state, 100-count state, fully exited mask/white-hold state, and teardown window. vercel deployment `dpl_GsQdkVTaPNiZKTPxjtaXD6T6ePZC` is ready and aliased to `www.stephenhung.me`; the same regression test passes against the live domain with a 6.822-second observed window from mounted overlay through teardown.

## git production baseline — 2026-09-03

goal: make the canonical next.js portfolio recoverable through normal git history instead of relying on vercel deployments as the only snapshots.

- [x] audit the parent repo, tracked history, canonical app, legacy mirror, and local-only state
- [x] add ignore boundaries for generated files, vercel state, qa artifacts, and the legacy static mirror
- [x] add a bun lockfile for reproducible installs
- [x] refresh the root readme around the canonical `portfolio/` app
- [x] scan the intended baseline for credentials and oversized files
- [x] stage only the canonical app and markdown project history
- [x] run fresh typecheck, build, and loader regression verification
- [x] commit the production baseline and create an annotated production tag
- [x] document the resulting commit, tag, and clean working-tree state

review: the canonical `portfolio/` next.js app, public assets, deployment config, bun lockfile, and markdown project history are now tracked. the legacy static mirror remains available locally but is ignored, along with generated next.js/vercel state, qa screenshots, unused-asset backups, and generated audit output. the obsolete root `stephen-projects.json` entry was removed from the index while the local mirror copy and prior git history remain intact.

verification: the staged baseline passed a public-repo scan with zero credential findings and no files over 5 mb. `bunx tsc --noEmit`, `bun run build` (27/27 pages), and `bun run test:loader -- http://localhost:3000` all pass; the loader regression completed in 6.445 seconds with the reference entrance, count, hold, and exit states. the final baseline is annotated as `v0.1.0` for production deployment `dpl_GsQdkVTaPNiZKTPxjtaXD6T6ePZC`.
