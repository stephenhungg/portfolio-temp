# stephen hung portfolio

the production portfolio is the next.js app in [`portfolio/`](portfolio/).

## local development

```bash
cd portfolio
bun install
bun run dev
```

## verification

```bash
cd portfolio
bunx tsc --noEmit
bun run build
bun run test:loader
```

## deployment

the `portfolio/` directory is linked directly to the vercel project `stephen`.

```bash
cd portfolio
bunx vercel --prod --yes
```

see [`portfolio/DEPLOY.md`](portfolio/DEPLOY.md) for route and domain checks.

## repository layout

- `portfolio/` contains the canonical application, public assets, tests, and deployment configuration.
- `tasks/` contains project decisions, lessons, and verification notes.
- the older static framer mirror remains available locally but is intentionally ignored by git.
