export type ProjectStatus = "live" | "archived" | "wip";
export type ProjectVisibility = "public" | "unlisted";

export interface Project {
  /** url-safe identifier - used as path /works/{slug} */
  slug: string;
  /** display title */
  title: string;
  /** sort year (most recent first) */
  year: number;
  /** human-readable date like "january 2026" */
  date?: string;
  /** one-sentence summary used in cards + listings */
  summary: string;
  /** tech / domain tags shown on cards */
  stack: string[];
  /** short labels (originally framer "tags" pairs) */
  tags?: string[];
  /** lifecycle */
  status: ProjectStatus;
  /** publishing state; wip projects may still be intentionally public */
  visibility?: ProjectVisibility;
  /** show prominently on home + works grid */
  featured: boolean;
  /** if true, /works/{slug} renders the corresponding mdx case study */
  hasCaseStudy: boolean;
  /** award/recognition string, optional */
  award?: string;
  /** structured spine summary used in case-study breadcrumb */
  spine?: string;
  /** external links - only present when relevant */
  links?: {
    live?: string;
    repo?: string;
    original?: string;
  };
  /** hero media for the case study page */
  hero?: {
    src: string;
    alt: string;
    type?: "image" | "video";
  };
  /** card image used in works grid */
  cardImage?: string;
  /** ordered list of in-product screenshots used on case study page */
  screenshots?: string[];
}

/**
 * adding a project:
 *   1. add an entry to this array
 *   2. (optional) drop a `content/case-studies/{slug}.mdx` and set hasCaseStudy: true
 *   3. that's it. /works updates automatically; /works/{slug} renders if mdx exists
 */
export const projects: Project[] = [
  {
    slug: "skarl",
    title: "skarl",
    year: 2026,
    date: "october 2026",
    summary:
      "evidence-backed settlement for human-data companies. multimodal clip verification, buyer-approved payment policies, and exact USDC accounting.",
    stack: ["Next.js", "TypeScript", "Convex", "Gemini", "Claude", "Coinbase CDP", "x402", "Base Sepolia", "Solana", "Expo"],
    tags: ["agent finance", "multimodal verification", "human data"],
    status: "wip",
    featured: false,
    hasCaseStudy: true,
    spine: "work evidence / payment policy / settlement",
    award: "best use of x402 @ cal hacks 13.0",
    links: { live: "https://skarl.devshardat.work", repo: "https://github.com/stephenhungg/skarl" },
    cardImage: "/images/skarl-card.webp",
    screenshots: [
      "/images/screenshots/skarl-01.webp",
      "/images/screenshots/skarl-02.webp",
      "/images/screenshots/skarl-03.webp",
    ],
  },
  {
    slug: "scalpal",
    title: "scalpal",
    year: 2026,
    date: "october 2026",
    summary:
      "mixed-reality surgery practice on meta quest 3s, with a voiced ai attending, a live multiplayer operating room, and simulated robot replay.",
    stack: ["Unity", "C#", "Meta Quest 3S", "SpacetimeDB", "ElevenLabs", "Claude", "Hono", "React", "MuJoCo", "Presage"],
    tags: ["mixed reality", "voice agents", "robot learning"],
    status: "wip",
    featured: false,
    hasCaseStudy: true,
    spine: "embodied learning / realtime simulation / robot replay",
    award: "best use of SpacetimeDB @ mhacks 2026",
    links: { live: "https://scalpal.tech", repo: "https://github.com/stephenhungg/scalpal" },
    cardImage: "/images/scalpal-card.webp",
    screenshots: [
      "/images/screenshots/scalpal-01.webp",
      "/images/screenshots/scalpal-02.webp",
      "/images/screenshots/scalpal-03.webp",
    ],
  },
  {
    slug: "kali",
    title: "kali",
    year: 2026,
    date: "june 2026",
    summary:
      "agentic context + finance layer for nonprofits. one chat across 13 connectors (bloomerang, salesforce npsp, m365, quickbooks, zoom, etc.) with cited answers + immutable audit log, plus two onchain rails on solana — http 402 agent donations and cause coins via meteora bonding curves.",
    stack: ["Next.js 16", "TypeScript", "Claude Sonnet 4.6", "Supabase", "Drizzle", "pgvector", "Voyage-3", "Inngest", "Privy", "Solana", "Meteora", "x402", "Tailwind"],
    tags: ["agent infra", "nonprofits", "onchain"],
    status: "live",
    featured: true,
    hasCaseStudy: true,
    spine: "agent context / x402 donations / cause coins",
    award:
      "hackdavis 2026 — winner, best use of solana.",
    links: { live: "https://kalilabs.ai" },
    cardImage: "/images/kali-card.webp",
    screenshots: [
      "/images/screenshots/kali-01.webp",
      "/images/screenshots/kali-02.webp",
      "/images/screenshots/kali-03.webp",
      "/images/screenshots/kali-04.webp",
    ],
  },
  {
    slug: "opal",
    title: "opal",
    year: 2026,
    date: "january 2026",
    summary:
      "ai gaming companion you can queue up with. yolov8 + depth estimation + livekit.",
    stack: ["React", "FastAPI", "Discord.py", "LiveKit", "YOLOv8", "browser automation"],
    tags: ["voice agents", "realtime", "browser"],
    status: "live",
    featured: true,
    hasCaseStudy: true,
    spine: "voice agents / realtime infra / browser control",
    award: "pump fund invested $250k at a $10m valuation; pitched live to tim draper",
    links: { repo: "https://github.com/qtzx06/opal" },
    cardImage: "/images/opal-card.webp",
    screenshots: [
      "/images/screenshots/opal-01.webp",
      "/images/screenshots/opal-03.webp",
      "/images/screenshots/opal-04.webp",
    ],
  },
  {
    slug: "darwin",
    title: "darwin",
    year: 2025,
    date: "october 2025",
    summary:
      "ai agents compete to build react components in real-time. react + letta + livekit + sui + three.js.",
    stack: ["React", "Letta", "LiveKit", "Sui", "Three.js"],
    tags: ["multi-agent", "interface arena", "codegen"],
    status: "live",
    featured: true,
    hasCaseStudy: true,
    award: "letta honorable mention at cal hacks 12.0",
    spine: "multi-agent systems / codegen / live interfaces",
    links: { live: "https://darwin.qtzx.dev", repo: "https://github.com/qtzx06/darwin" },
    cardImage: "/images/darwin-card.webp",
    screenshots: [
      "/images/screenshots/darwin-01.webp",
      "/images/screenshots/darwin-02.webp",
      "/images/screenshots/darwin-03.webp",
      "/images/screenshots/darwin-04.webp",
    ],
  },
  {
    slug: "bip",
    title: "bip",
    year: 2026,
    date: "2026",
    summary:
      "agents that sign up for services, verify emails, and pay. x402 + browser use + agentmail.",
    stack: ["x402", "Browser Use", "AgentMail", "Convex", "Bun"],
    tags: ["identity", "agent payments", "browser auth"],
    status: "live",
    featured: true,
    hasCaseStudy: true,
    spine: "identity / payments / browser automation",
    award: "built at browser use web agents hackathon at y combinator hq",
    links: { live: "https://bip.stephenhung.me" },
    cardImage: "/images/bip-card.webp",
    screenshots: [
      "/images/screenshots/bip-01.webp",
      "/images/screenshots/bip-02.webp",
      "/images/screenshots/bip-03.webp",
      "/images/screenshots/bip-04.webp",
    ],
  },
  {
    slug: "clarifai",
    title: "clarifai",
    year: 2025,
    date: "december 2025",
    summary:
      "turns research papers into 3blue1brown-style explainer videos. next.js + fastapi + gemini + manim.",
    stack: ["Next.js", "FastAPI", "Gemini", "Manim"],
    tags: ["research agents", "papers", "code + video"],
    status: "live",
    featured: true,
    hasCaseStudy: true,
    spine: "research agents / codegen / video generation",
    award: "originated at nvidia ai agent hackathon, rebuilt for public demo",
    links: { live: "https://clarifai.stephenhung.me", repo: "https://github.com/qtzx06/clarifai" },
    cardImage: "/images/clarifai-card.webp",
    screenshots: [
      "/images/screenshots/clarifai-01.webp",
      "/images/screenshots/clarifai-02.webp",
      "/images/screenshots/clarifai-03.webp",
      "/images/screenshots/clarifai-04.webp",
    ],
  },
  {
    slug: "vima",
    title: "vima",
    year: 2026,
    summary:
      "multimodal temporal/spatial memory and verification for vlm outputs. gemini + sam + depth + colmap.",
    stack: ["Gemini", "SAM", "Depth", "COLMAP"],
    status: "wip",
    featured: false,
    hasCaseStudy: true,
    award: "ironsite prize + best use of solana @ hacktech 2026",
    links: { live: "https://vimaspatial.tech", repo: "https://github.com/stephenhungg/vima" },
    cardImage: "/images/vima-card.webp",
    screenshots: [
      "/images/screenshots/vima-03.webp",
      "/images/screenshots/vima-04.webp",
      "/images/screenshots/vima-01.webp",
    ],
  },
  {
    slug: "lapis",
    title: "lapis",
    year: 2026,
    summary:
      "claude does diligence on a github repo, then settles tokenized equity on xrpl with crypto-enforced vesting.",
    stack: ["Claude API", "XRPL"],
    status: "wip",
    featured: false,
    hasCaseStudy: true,
    award: "1st overall + 1st sui foundation track @ b@bhacks 2026",
    links: { repo: "https://github.com/stephenhungg/lapis" },
    cardImage: "/images/lapis-card.webp",
    screenshots: [
      "/images/screenshots/lapis-01.webp",
      "/images/screenshots/lapis-02.webp",
      "/images/screenshots/lapis-03.webp",
      "/images/screenshots/lapis-04.webp",
    ],
  },
  {
    slug: "iris",
    title: "iris",
    year: 2026,
    summary:
      "prompt-driven video editor for localized edits with continuity across shots. clip + sam 2.1 + ffmpeg.",
    stack: ["FastAPI", "CLIP", "SAM 2.1", "ffmpeg", "PostgreSQL"],
    status: "wip",
    featured: false,
    hasCaseStudy: true,
    award: "2nd overall @ citrus hacks 2026",
    links: { live: "https://useiris.tech", repo: "https://github.com/stephenhungg/iris" },
    cardImage: "/images/iris-card.webp",
    screenshots: [
      "/images/screenshots/iris-01.webp",
      "/images/screenshots/iris-02.webp",
      "/images/screenshots/iris-03.webp",
    ],
  },
  {
    slug: "yolodex",
    title: "yolodex",
    year: 2026,
    date: "april 2026",
    summary:
      "openai codex skill repo turning videos into fully trained object detection models. yolo + codex.",
    stack: ["YOLO", "OpenAI Codex"],
    status: "live",
    featured: false,
    hasCaseStudy: true,
    award: "top 5 ($10k) @ openai codex hackathon, demoed to sam altman + greg brockman",
    links: { live: "https://yolodex.stephenhung.me", repo: "https://github.com/qtzx06/yolodex" },
    cardImage: "/images/yolodex-card.webp",
    screenshots: [
      "/images/screenshots/yolodex-01.webp",
      "/images/screenshots/yolodex-02.webp",
      "/images/screenshots/yolodex-03.webp",
      "/images/screenshots/yolodex-04.webp",
    ],
  },
  {
    slug: "flow",
    title: "flow",
    year: 2026,
    date: "january 2026",
    summary:
      "voice-to-3d spatial learning platform with gaussian splat rendering. react + gemini + marble + elevenlabs.",
    stack: ["React", "Gemini", "Marble", "ElevenLabs"],
    status: "live",
    featured: false,
    hasCaseStudy: true,
    award: "president's pick + mlh best use of elevenlabs @ sb hacks xii",
    links: { live: "https://flow.stephenhung.me" },
    cardImage: "/images/flow-card.webp",
    screenshots: [
      "/images/screenshots/flow-01.webp",
      "/images/screenshots/flow-02.webp",
      "/images/screenshots/flow-03.webp",
      "/images/screenshots/flow-04.webp",
    ],
  },
  {
    slug: "tenzin",
    title: "tenzin",
    year: 2026,
    summary:
      "personal claude code daemon that runs 24/7 on a vps with discord, telegram, voice, cron, and multi-session thread isolation. bun + ts.",
    stack: ["Bun", "TypeScript", "Claude Code", "Discord", "Telegram", "VPS bridge"],
    status: "live",
    featured: false,
    hasCaseStudy: true,
    cardImage: "/images/tenzin-card.webp",
  },
  {
    slug: "angel",
    title: "angel",
    year: 2026,
    date: "may 2026",
    summary:
      "embodied desktop ai coworker - swipe-based persona discovery, nia semantic memory, sms + discord fallback, and a kawaii electron/r3f room running codex in-world.",
    stack: ["Next.js", "Electron", "React Three Fiber", "Three-VRM", "Convex", "Claude Sonnet 4.6", "Codex", "Nia", "Twilio"],
    tags: ["desktop agents", "memory", "embodiment"],
    status: "live",
    featured: false,
    hasCaseStudy: true,
    spine: "embodied agents / persona discovery / multi-surface presence",
    award: "best overall @ nozomio hackathon",
    links: { live: "https://angel-swipe.vercel.app", repo: "https://github.com/stephenhungg/angel" },
    cardImage: "/images/angel-card.webp",
    screenshots: [
      "/images/screenshots/angel-01.webp",
      "/images/screenshots/angel-02.webp",
      "/images/screenshots/angel-03.webp",
      "/images/screenshots/angel-04.webp",
    ],
  },
  {
    slug: "crakd-co",
    title: "crakd",
    year: 2025,
    date: "april 2025",
    summary:
      "natural-language search for github devs. ranks 60% gemini judgment + 40% raw github metrics.",
    stack: ["React", "FastAPI", "Gemini", "GitHub GraphQL"],
    status: "live",
    featured: false,
    hasCaseStudy: true,
    award: "top 10 @ b.e.l.l.e sf ai hackathon",
    links: { live: "https://crakd.co", repo: "https://github.com/qtzx06/crakd" },
    cardImage: "/images/crakd-co-card.webp",
    screenshots: [
      "/images/screenshots/crakd-01.webp",
      "/images/screenshots/crakd-02.webp",
      "/images/screenshots/crakd-03.webp",
      "/images/screenshots/crakd-04.webp",
    ],
  },
];

/**
 * Experience - orgs / roles. Rendered on /about under "experience." section.
 * Order is reverse-chronological (most recent first).
 */
export interface ExperienceEntry {
  org: string;
  role: string;
  /** date range like "2025 - present" or "summer 2025" */
  period: string;
  summary: string;
  link?: string;
}

export const experience: ExperienceEntry[] = [
  {
    org: "Walmart Global Tech",
    role: "ai/ml engineer intern",
    period: "june 2026 - aug 2026",
    summary:
      "built real-time computer vision and re-identification systems, an agent-driven end-to-end testing platform, and personalized multi-tower search ranking for walmart.com.",
  },
  {
    org: "Enactus Berkeley",
    role: "member",
    period: "since spring 2026",
    summary: "advising technical founders at uc berkeley and designing beautiful applications for internal use.",
  },
  {
    org: "Cal Blueprint",
    role: "software developer",
    period: "since sept 2025",
    summary:
      "building react native + expo app replacing replate's pen and paper donation logging across a network rescuing 1m+ lbs of surplus food annually for 80+ recipient nonprofits. architected token based auth extending their ruby on rails backend.",
  },
  {
    org: "ClearPath Medical",
    role: "software engineering consultant",
    period: "fall 2025",
    summary:
      "built a pfmea automation tool with fastapi + llms that converts work-instruction pdfs into risk assessments. cut analysis time for fda-compliant medical device qc by 85%. websocket job tracking, 4-phase validation pipeline, local sqlite to keep phi off the network.",
  },
  {
    org: "Theta Tau",
    role: "professional development chair",
    period: "fall 2025",
    summary: "professional engineering fraternity at uc berkeley. ran professional development programming for the active body.",
  },
  {
    org: "OptiGenix",
    role: "software engineering intern",
    period: "summer 2025",
    summary:
      "trained a generative ai model on google vertex ai to 92.3% extraction accuracy on 60 unstructured blood test pdfs. built the gcp pipeline behind 7,500+ monthly pdf uploads. iam scoping, encryption at rest, audit trails so the hospital side passed compliance review.",
  },
];

// helpers

/**
 * Computes a sortable month-year key from a project. Parses `date` if present
 * (e.g. "january 2026" → 2026.0833) for fine-grained ordering, falls back to
 * `year` alone (treated as december = end of year) so projects without a month
 * still rank reasonably against dated ones.
 */
function monthYearKey(project: Project): number {
  const months: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };
  if (project.date) {
    const lower = project.date.toLowerCase();
    for (const [name, n] of Object.entries(months)) {
      if (lower.includes(name)) return project.year + n / 12;
    }
  }
  // no date string → use december (end of year) so it sorts AFTER dated jan-nov
  // entries of the same year. tweak to /24 if you want undated to sort earliest.
  return project.year + 12 / 12;
}

const byMonthYearDesc = (a: Project, b: Project) => monthYearKey(b) - monthYearKey(a);

export const publicProjects = projects
  .filter((project) => project.visibility !== "unlisted")
  .sort(byMonthYearDesc);
export const featuredProjects = publicProjects.filter((project) => project.featured);
export const caseStudyProjects = publicProjects.filter((project) => project.hasCaseStudy);
export const workGridProjects = publicProjects;
export const projectsBySlug: Record<string, Project> = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
);

export function getProject(slug: string): Project | undefined {
  return projectsBySlug[slug];
}

export function getRelatedProjects(current: Project, limit = 2): Project[] {
  const currentTerms = new Set([...(current.tags ?? []), ...current.stack.map((item) => item.toLowerCase())]);
  return caseStudyProjects
    .filter((project) => project.slug !== current.slug)
    .map((project) => {
      const terms = [...(project.tags ?? []), ...project.stack.map((item) => item.toLowerCase())];
      const relevance = terms.reduce((score, term) => score + Number(currentTerms.has(term)), 0);
      return { project, relevance };
    })
    .sort((a, b) => b.relevance - a.relevance || byMonthYearDesc(a.project, b.project))
    .slice(0, limit)
    .map(({ project }) => project);
}

export function projectDateIso(project: Project): string {
  const months: Record<string, string> = {
    january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
    july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
  };
  const month = Object.entries(months).find(([name]) => project.date?.toLowerCase().includes(name))?.[1] ?? "01";
  return `${project.year}-${month}-01`;
}
