# yuya exact mirror rebuild todo

- [x] modularize project content into a standalone data file
- [x] update runtime overrides to read project copy from shared data
- [x] update rewrite script to reuse the same project data
- [x] verify local routes still rewrite and render correctly
- [x] normalize public routing to absolute canonical paths
- [x] split site-wide config from project content
- [x] add automated route/href hygiene check
- [x] convert source project folders to explicit redirects

## current modularization plan

keep the framer runtime mirror as the visual source of truth. move project-specific content out of `stephen-overrides.js` and `scripts/rewrite-yuya-content.mjs` into a shared `stephen-projects.json` file, then have both layers build their replacements from that file. this should make future project edits a data-only change without porting the layout yet.

## modularization review

- added `stephen-projects.json` as the source for project slugs, titles, tags, spine labels, and long-form copy replacements
- refactored `stephen-overrides.js` to fetch that json at runtime and build text/link/route replacements from it
- refactored `scripts/rewrite-yuya-content.mjs` to read the same json and skip mutating the json/override source files
- verified `npm run rewrite`, js syntax checks, json parsing, served json headers, and all four project routes over the local dev server
- limitation: verification was route/content level; no playwright/browser screenshot diff is installed in this repo

## routing review

- canonical public routes now live in `stephen-site.json`
- runtime link normalization in `stephen-overrides.js` maps nav labels and project slugs to `/`, `/works`, `/about`, `/contact`, and `/works/{slug}`
- `npm run rewrite` now rewrites mirrored anchor/canonical hrefs to absolute public routes instead of relative framer paths
- verified `/`, `/works`, `/works/opal`, `/works/darwin`, `/works/bip`, `/works/clarifai`, `/about`, and `/contact` all resolve with http 200 through the local server
- verified the works page emits only `/works/opal`, `/works/darwin`, `/works/bip`, and `/works/clarifai` for project cards

## cleanup review

- added `stephen-site.json` for routes, social links, global text replacements, and global href replacements
- kept `stephen-projects.json` focused on project slugs/copy/tags/spine data
- updated `stephen-overrides.js` to load both site and project configs at runtime
- updated `scripts/rewrite-yuya-content.mjs` to load both configs, normalize hrefs idempotently, and generate redirects for source yuya project slugs
- added `scripts/check-routes.mjs` and `npm run check:routes`
- verified `npm run rewrite`, `npm run check:routes`, js/json syntax checks, public route http 200s, source slug redirects, and absence of known bad href patterns

## card image and casing review

- copied generated project card assets into stable local files under `images/`: `opal-card.png`, `darwin-card.png`, `bip-card.png`, and `clarifai-card.png`
- added `cardImage` fields to `stephen-projects.json` so the works page card media is data-driven
- updated `scripts/rewrite-yuya-content.mjs` to stamp project card image `src`/`srcset` values from project data
- scoped the home hero name fix so it renders `Stephen` / `Hung` instead of duplicating `Stephen Hung`
- verified all four card images appear in `works/index.html`, no visible all-caps text remains across the main routes, and `npm run check:routes` passes

## full project inventory review

- audited the original live portfolio at `https://www.stephenhung.me/projects`
- expanded `stephen-projects.json` beyond the original 4 visible framer projects
- kept `detailPage: true` for the four local framer case-study pages and `detailPage: false` for archive-only projects
- added a generated `/works` archive section from `stephen-projects.json` so non-featured projects are visible without hand-editing framer html
- added `scripts/project-utils.mjs` and made `scripts/check-routes.mjs` derive project expectations from config instead of hardcoding four routes
- verified `npm run rewrite` and `npm run check:routes`

## curated project and routing review

- audited `~/Documents/GitHub` with a subagent and used it only as candidate evidence, not automatic public inventory
- removed projects the user did not make from the visible archive: `scale-diffusion`, `memopal`, and `advisr`
- curated `/works` to 11 visible owned/strong projects from 2024 onward while keeping the larger inventory in json
- added runtime card-image rewriting in `stephen-overrides.js` so framer hydration cannot swap card images back to old template assets
- changed local project hrefs to trailing-slash directory routes like `/works/opal/`
- made `npm run rewrite` generate `_redirects`, `vercel.json`, and `404.html` from `stephen-projects.json` so deploy routing stays in sync with project config
- verified `npm run check:routes`; route check now reports 13 html files, 11 visible projects, and 24 total projects

## hydration routing hardening plan

- [x] debug routing from the code path instead of browser poking
- [x] treat `yuya.framer.website` links as internal template links before generic external-link bypass
- [x] map source project slugs directly to owned project routes at runtime
- [x] patch framer collection slug utils so hydration resolves owned slugs natively
- [x] remove the work-card click interception hack after patching collection routing
- [x] extend route checks to validate generated deploy routing files
- [x] add deploy redirects for framer source slugs so post-hydration second hops cannot 404
- [x] replace the plain python localhost server with a tiny node server that honors `_redirects`

- [x] re-read `framer-runtime-mirror` skill and identify the failure mode
- [x] record correction in `tasks/lessons.md`
- [x] replace custom vite rebuild with the raw yuya framer runtime mirror
- [x] swap yuya template content for stephen content inside the mirrored runtime
- [x] swap project media while preserving template layout and motion
- [x] serve the static mirror locally over http
- [x] verify homepage, works, about, contact, and project routes on desktop/mobile
- [x] verify sampled routes with live framer/font hosts blocked
- [x] document exact mirror output and limitations

## rule for this redo

the implementation base must be the captured framer runtime from `mirror/yuya/site`, not a clean react rebuild. preserve the yuya template's layout, responsive variants, framer classes, runtime scripts, and motion behavior unless a content swap forces a minimal text/media edit.

## review

- output path: repo root, copied from `mirror/yuya/site`
- source template: `https://yuya.framer.website`
- captured routes: `/`, `/works`, `/about`, `/contact`, `/works/stone-mind`, `/works/violet-orbit`, `/works/visual-screen-models`, `/works/flexible-area-models`
- stephen routes: `/`, `/works`, `/about`, `/contact`, `/works/opal`, `/works/darwin`, `/works/bip`, `/works/clarifai`
- verification: 8 routes checked across desktop and mobile with playwright; no stale yuya copy, no broken loaded images, no console errors, no horizontal overflow, no framer badge
- blocked-host verification: sampled routes still render with `framerusercontent.com`, `fonts.gstatic.com`, `events.framer.com`, and `framer.com` blocked
- limitation: framer `.framercms` binaries are intentionally preserved for hydration stability; stephen content/links are applied via `stephen-overrides.js`
