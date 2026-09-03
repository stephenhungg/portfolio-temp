import type { Metadata } from "next";
import Image from "next/image";
import { Container, Section, Stack } from "@/components/layout";
import { DisplayHeroText, Caption } from "@/components/typography";
import { Appear } from "@/components/motion/Appear";
import { MaskedLine } from "@/components/motion/MaskedLine";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PillLink } from "@/components/Pill";
import { ServicesHover } from "@/components/ServicesHover";
import { LogoMarquee } from "@/components/LogoMarquee";
import { FAQItem } from "@/components/FAQItem";
import { experience } from "@/data/projects";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About - Stephen Hung",
    description: site.description,
    url: "/about",
    type: "profile",
  },
};

// skills: each label gets a hover image. themed chrome-on-white renders.
// drop more at /public/images/services/{slug}.png and reference them here.
const skills = [
  { label: "Agents", image: "/images/services/agents.png" },
  { label: "Interfaces", image: "/images/services/interfaces.png" },
  { label: "Infra", image: "/images/services/infra.webp" },
  { label: "Automation", image: "/images/services/automation.webp" },
  { label: "Systems", image: "/images/services/systems.webp" },
];

// orgs you've actually won at, shipped sponsored projects with, or use heavily.
// each entry maps to a real accolade or stack call somewhere in /works.
//   openai      = yolodex (top 5 @ codex hackathon, demoed to sam altman)
//   nvidia      = clarifai (originated at nvidia ai agent hackathon)
//   anthropic   = claude api across opal, darwin, tenzin, clarifai
//   gemini      = google gemini api across clarifai, vima, iris, flow, crakd
//   mlh         = best use of elevenlabs @ sb hacks xii (flow)
//   walmart     = ai/ml engineer intern @ walmart global tech, summer 2026
//   ycombinator = bip (built at browser use hackathon @ yc hq)
//   pump.fun    = opal (pump fund investment, pitched live to tim draper)
//   cal hacks   = darwin (letta honorable mention @ cal hacks 12.0)
//   solana      = vima (best use of solana @ hacktech 2026)
//   sui         = lapis (1st sui foundation track @ b@bhacks), darwin
//   elevenlabs  = flow (best use of elevenlabs @ sb hacks xii), darwin
//   livekit     = opal (89ms voice), darwin
//   letta       = darwin (honorable mention @ cal hacks 12)
//   browser use = bip
//   xrpl        = lapis (tokenized equity settled on xrpl)
//   berkeley    = eecs '28 + cal blueprint + theta tau
const partnerLogos = [
  { name: "Walmart", image: "/images/logos/walmart.svg" },
  { name: "OpenAI", image: "/images/logos/openai.svg" },
  { name: "NVIDIA", image: "/images/logos/nvidia.svg" },
  { name: "Anthropic", image: "/images/logos/anthropic.svg" },
  { name: "Gemini", image: "/images/logos/gemini.svg" },
  { name: "Y Combinator", image: "/images/logos/ycombinator.svg" },
  { name: "pump.fun" },
  { name: "Cal Hacks" },
  { name: "MLH", image: "/images/logos/mlh.svg" },
  { name: "Solana", image: "/images/logos/solana.svg" },
  { name: "Sui" },
  { name: "ElevenLabs", image: "/images/logos/elevenlabs.svg" },
  { name: "LiveKit", image: "/images/logos/livekit.svg" },
  { name: "XRPL", image: "/images/logos/ripple.svg" },
  { name: "Berkeley" },
];

// stack tightened to actual fluency - appears in the projects, not aspirational
const tools = [
  "React", "Next.js", "TypeScript", "Tailwind", "GSAP", "Three.js",
  "FastAPI", "Bun", "Convex", "Express",
  "Claude API", "Gemini", "OpenAI Codex", "LiveKit", "ElevenLabs",
  "YOLO", "SAM", "CLIP", "manim", "COLMAP",
  "Sui Move", "XRPL", "Solana", "x402",
  "Vercel", "Railway", "Docker",
];

const faqs = [
  {
    q: "What's your background?",
    a: "EECS at UC Berkeley, class of '28. Started shipping in middle school with a JavaScript Mother's Day card, then VEX robotics captain (PID + odometry for autonomous routines), then FBLA nationals (mobile + computer programming), now hackathons. Valedictorian out of Ayala HS, GPA 4.69. Currently involved across several technology organizations at UC Berkeley, building whatever catches my interest in my free time.",
  },
  {
    q: "What are you working on now?",
    a: "Honestly, whatever's pulling me. Random corporate and collegiate hackathons every few weeks, side projects with friends that start in a discord call at 2am, design work for people who vibe with my taste, and a rotating stack of personal builds I'll ship when they're good. Always one project shipping, one being rebuilt, one fresh, usually too many at once. If something's interesting enough to break my sleep schedule for, I'm probably already on it.",
  },
  {
    q: "Are you open to internships or full-time roles?",
    a: "I just finished at Walmart Global Tech and am searching for summer 2027 internships, high-signal collaborations, and post-grad full-time roles beginning in 2028. I’m most interested in agentic systems, computer vision, generalist software engineering, and product-focused frontend work. Email me with the role and I’ll reply within 48 hours.",
  },
  {
    q: "How do you choose what to build?",
    a: "If it's a hackathon, pick something that demos in 90 seconds and could keep going for a year. If it's a personal project, pick the part of the stack I haven't shipped before. Either way, the rule is novel tech + a constraint that forces taste. Lapis came from \"can crypto conditions enforce vesting without lawyers,\" Opal came from \"can an agent actually queue up with you,\" Yolodex came from \"can you turn a YouTube clip into a trained YOLO model overnight.\"",
  },
  {
    q: "What's your stack philosophy?",
    a: "Bun > npm. Vite > CRA. TypeScript strict. FastAPI for the backend, Next.js for the frontend, GSAP for motion. AI work in Python or Bun depending on which one's faster to ship. I optimize for how fast I can rebuild something, not how clever the architecture looks.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1 pt-32 tablet:pt-[220px] relative z-10 bg-background">
        {/* hero - name centered, no avatar (yuya pattern) */}
        <Section className="!pt-0 !pb-8 tablet:!pb-12">
          <Container>
            <h1>
              <Stack size="xs" className="text-center">
              <MaskedLine className="pb-[6px] tablet:pb-[10px] desktop:pb-[14px]">
                <DisplayHeroText className="text-center">stephen</DisplayHeroText>
              </MaskedLine>
              <MaskedLine className="pb-[6px] tablet:pb-[10px] desktop:pb-[14px]">
                <DisplayHeroText className="text-center">hung.</DisplayHeroText>
              </MaskedLine>
              </Stack>
            </h1>
          </Container>
        </Section>

        {/* about - eyebrow + show more (back to home) + bio */}
        <Section>
          <Container>
            <div className="flex items-center justify-between mb-6 tablet:mb-8">
              <ScrollReveal variant="y-100-up">
                <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em]">about.</span>
              </ScrollReveal>
              <ScrollReveal variant="y-100-up">
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[16px] font-medium yuya-link hover:text-muted-medium"
                  data-cursor-grow
                >
                  résumé ↗
                </a>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-12 gap-6 tablet:gap-10">
              <div className="col-span-12 tablet:col-span-6">
                <ScrollReveal variant="y175-up">
                  <p className="font-sans font-medium leading-[1.15] tracking-[-0.06em] text-[34px] tablet:text-[44px] desktop:text-[50px]">
                    {site.headline}
                  </p>
                </ScrollReveal>
              </div>
            </div>

            {/* image bigger now: col-span-8 (was 7), card col-start-10 col-span-3 right, vertically centered */}
            <div className="mt-12 tablet:mt-16 grid grid-cols-1 tablet:grid-cols-12 gap-6 tablet:gap-10 items-center">
              <div className="tablet:col-span-8">
                <ScrollReveal variant="y175-up">
                  <div className="relative aspect-[881/665] bg-muted-light overflow-hidden">
                    <Image
                      src="/images/about-photo.webp"
                      alt="Stephen Hung at the OpenAI hackathon"
                      fill
                      sizes="(max-width: 1200px) 100vw, 880px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </ScrollReveal>
              </div>
              <div className="tablet:col-span-3 tablet:col-start-10">
                <ScrollReveal variant="y175-up">
                  <p className="font-sans font-medium text-[18px] tablet:text-[20px] leading-[1.3] tracking-[-0.04em]">
                    {site.bioDetail}
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </Container>
        </Section>

        {/* skills - display list, italic centered */}
        <Section>
          <Container>
            <ScrollReveal variant="y-100-up">
              <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em] mb-8 tablet:mb-12 block">skills.</span>
            </ScrollReveal>
            <ScrollReveal variant="y175-up">
              <ServicesHover services={skills} />
            </ScrollReveal>
          </Container>
        </Section>

        {/* logos marquee - yuya pattern below skills */}
        <Section className="!py-12 tablet:!py-16">
          <Container>
            <LogoMarquee logos={partnerLogos} duration={35} />
          </Container>
        </Section>

        {/* 2-image gallery - yuya pattern below logos: big left + smaller right top-aligned */}
        <Section className="!pt-0 !pb-16 tablet:!pb-20">
          <Container>
            <div className="grid grid-cols-1 tablet:grid-cols-12 gap-5 items-start">
              <div className="tablet:col-span-7">
                <ScrollReveal variant="y175-up">
                  <div className="relative aspect-[744/657] bg-muted-light overflow-hidden">
                    <Image
                      src="/images/about-salt-flats.webp"
                      alt="Stephen Hung at sunset in the salt flats"
                      fill
                      sizes="(max-width: 1200px) 100vw, 760px"
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>
              <div className="tablet:col-span-5">
                <ScrollReveal variant="y175-up">
                  <div className="relative aspect-[496/387] bg-muted-light overflow-hidden">
                    <Image
                      src="/images/gallery-2.webp"
                      alt="Stephen at Yosemite"
                      fill
                      sizes="(max-width: 1200px) 100vw, 540px"
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </Container>
        </Section>

        {/* tools wall */}
        <Section>
          <Container>
            <ScrollReveal variant="y-100-up">
              <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em] mb-6 tablet:mb-8 block">stack.</span>
            </ScrollReveal>
            <ScrollReveal variant="y175-up">
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <Caption key={tool} className="px-3 py-1.5 bg-muted-light font-mono text-[14px]">
                    {tool}
                  </Caption>
                ))}
              </div>
            </ScrollReveal>
          </Container>
        </Section>

        {/* experience - orgs · roles · dates */}
        <Section>
          <Container>
            <ScrollReveal variant="y-100-up">
              <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em] mb-6 tablet:mb-8 block">experience.</span>
            </ScrollReveal>
            <div className="flex flex-col">
              {experience.map((e, i) => (
                <ScrollReveal key={e.org} variant="y-100-up">
                  <div
                    className={cn(
                      "grid grid-cols-12 gap-4 tablet:gap-8 py-5 tablet:py-7",
                      i === 0 ? "border-t border-muted-light" : "",
                      "border-b border-muted-light",
                    )}
                  >
                    <div className="col-span-12 tablet:col-span-3">
                      <div className="font-sans text-[18px] tablet:text-[22px] font-medium tracking-[-0.04em]">{e.org}</div>
                    </div>
                    <div className="col-span-6 tablet:col-span-3 font-mono text-[12px] uppercase tracking-[0.05em] text-muted-medium tablet:pt-1.5">
                      {e.role}
                    </div>
                    <div className="col-span-12 tablet:col-span-4 font-sans text-[15px] leading-[1.4] order-3 tablet:order-none">
                      {e.summary}
                    </div>
                    <div className="col-span-6 tablet:col-span-2 tablet:text-right font-mono text-[12px] text-muted-medium tablet:pt-1.5">
                      {e.period}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>

        {/* faqs */}
        <Section>
          <Container>
            <ScrollReveal variant="y-100-up">
              <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em] mb-6 tablet:mb-8 block">faqs.</span>
            </ScrollReveal>
            <div className="max-w-3xl">
              {faqs.map((faq) => (
                <ScrollReveal key={faq.q} variant="y-100-up">
                  <FAQItem question={faq.q} answer={faq.a} />
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
