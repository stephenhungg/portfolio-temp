# deploy

## first time setup

```bash
cd portfolio
bunx vercel link        # link to a new vercel project
bunx vercel --prod      # deploy to production
```

when prompted, set:
- **root directory**: `portfolio`
- **build command**: `bun run build` (or leave default)
- **output directory**: `.next` (vercel auto-detects)
- **install command**: `bun install` (vercel auto-detects)
- **framework**: Next.js

## domains

once deployed, attach `stephenhung.me`:

```bash
bunx vercel domains add stephenhung.me
```

then in vercel dashboard: project → settings → domains → assign `stephenhung.me` to production.

if the domain is currently pointed at the old portfolio (the three.js next app at `~/Documents/GitHub/portfolio-website`), the dns swap-over needs to be done in vercel, not at the registrar - both projects live in the same vercel account.

## redirects

legacy framer source-slug redirects are configured in `next.config.ts` under `redirects()`:
- `/works/stone-mind` → `/works/opal`
- `/works/violet-orbit` → `/works/darwin`
- `/works/visual-screen-models` → `/works/bip`
- `/works/flexible-area-models` → `/works/clarifai`

these are 308 (permanent) and handled by next.js on vercel without any vercel.json.

## further deploys

```bash
cd portfolio
bunx vercel              # preview deploy
bunx vercel --prod       # production deploy
```

or push to the connected git branch and vercel auto-deploys.

## environment variables

none yet. if a contact form backend gets added later (resend, postmark, etc), add `RESEND_API_KEY` etc via `bunx vercel env add`.

## verifying production

after deploy, check:
- `/`, `/works`, `/about`, `/contact` → 200
- `/works/opal`, `/works/darwin`, `/works/bip`, `/works/clarifai` → 200 (statically prerendered)
- `/works/stone-mind` → 308 redirect to `/works/opal`
- run lighthouse on home: target ≥90 perf, 100 a11y, ≥95 seo
