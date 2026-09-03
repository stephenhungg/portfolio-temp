# portfolio

stephen hung's personal site. next 16 + tailwind v4 + gsap, ported from a captured framer template (`__mirror/yuya/`) into a clean modular codebase.

## stack

- **next 16.2** with app router + turbopack (default)
- **react 19.2**
- **tailwind v4** - design tokens via `@theme` directive in `app/globals.css`
- **typescript strict**
- **gsap 3.15** + `@gsap/react` - entrance and scroll-reveal animations using framer-extracted easing curves (`yuyaPrimary`, `yuyaScale`, `yuyaInOut`)
- **mdx** via `@next/mdx` for case study bodies
- **bun** for install + run

## structure

```
app/
  page.tsx                 home
  works/
    page.tsx               works listing (featured grid + archive)
    [slug]/page.tsx        case study template (dynamic, SSG)
  about/page.tsx
  contact/page.tsx
  layout.tsx               root layout - Inter + Fragment Mono via next/font/google
  globals.css              tailwind theme + yuya tokens + .prose-yuya for mdx
  sitemap.ts               public sitemap.xml
  robots.ts                public robots.txt
mdx-components.tsx         global mdx component map
components/
  typography.tsx           DisplayHero, DisplayLarge, …, Eyebrow, Code
  layout.tsx               Container, Section, Stack
  Nav.tsx, Footer.tsx
  ContactForm.tsx          mailto-based form with status states
  ProjectCardImage.tsx     reusable next/image card
  motion/
    Appear.tsx             mount-time entrance (gsap.to with yuya easing)
    ScrollReveal.tsx       in-view entrance (IntersectionObserver + gsap)
    Marquee.tsx            infinite horizontal loop (gsap timeline)
data/
  projects.ts              typed Project schema + 21 entries
  site.ts                  global site config (email, socials, nav)
content/
  case-studies/            mdx bodies for opal, darwin, bip, clarifai
lib/
  motion.ts                registerGsap + appearProps + yuyaMotion config
  utils.ts                 cn helper
public/
  fonts/                   captured framer fonts (fallback only - primary is next/font)
  images/                  project card images
scripts/
  screenshot.mjs           playwright visual diff: 5 routes × 2 viewports → reference/baseline/
```

## adding a project

1. add an entry to `data/projects.ts` (typed `Project`)
2. **case study?** drop `content/case-studies/{slug}.mdx` and set `hasCaseStudy: true`
3. drop card image at `public/images/{slug}-card.png`
4. `bun run build` - works listing + dynamic route auto-update

## scripts

```bash
bun run dev              # dev server, turbopack, :3000
bun run build            # production build, ssg static pages
bun run start            # serve production build
```

## deploy

see `DEPLOY.md`. tldr: `cd portfolio && bunx vercel link && bunx vercel --prod`. project root is this `portfolio/` directory; legacy framer slug redirects + cache headers + security headers are wired via `next.config.ts` and `vercel.json`.

## motion specs

framer easing curves extracted from the mirror, registered once in `lib/motion.ts`:

- primary: `cubic-bezier(0.42, 0.21, 0, 1)` - duration 1.2s
- scale: `cubic-bezier(0, 0.13, 0, 0.98)`
- secondary in-out: `cubic-bezier(0.44, 0, 0.56, 1)` - duration 0.8s, stagger 0.6s

variants: `y-100-up`, `y175-up`, `y265-up`, `y485-up`, `scale-in`.
