import Link from "next/link";
import type { Metadata } from "next";
import { Container, Section } from "@/components/layout";
import { DisplayHero, Caption } from "@/components/typography";
import { Appear } from "@/components/motion/Appear";
import { MaskedLine } from "@/components/motion/MaskedLine";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { projects, workGridProjects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { TiltedCard } from "@/components/TiltedCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Selected work by Stephen Hung. ai agents, computer vision, creative tools, onchain infra, and hackathon systems.",
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Works - Stephen Hung",
    description:
      "Selected work by Stephen Hung. ai agents, computer vision, creative tools, onchain infra, and hackathon systems.",
    url: "/works",
    type: "website",
  },
};

function targetForProject(project: Project): { href: string; external: boolean } {
  if (project.hasCaseStudy) return { href: `/works/${project.slug}`, external: false };
  if (project.links?.live) return { href: project.links.live, external: true };
  if (project.links?.original) return { href: project.links.original, external: true };
  if (project.links?.repo) return { href: project.links.repo, external: true };
  return { href: "#", external: false };
}

function ImageCard({ project }: { project: Project }) {
  const target = targetForProject(project);

  // hover overlay - title floats over the image with a gradient scrim, fades
  // in on group-hover. permanent (no fade) for the no-cardImage fallback so the
  // title is always visible when there's no image.
  const overlay = project.cardImage ? (
    <div className="absolute inset-0 flex items-end p-6 tablet:p-8 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-0 group-hover:opacity-100 [transition:opacity_500ms_cubic-bezier(0.42,0.21,0,1)]">
      <span className="text-white font-sans font-medium text-[36px] tablet:text-[48px] tracking-[-0.04em] leading-[1.1]">
        {project.title}
      </span>
    </div>
  ) : (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <span
        className={cn(
          "font-sans font-medium text-[36px] tablet:text-[44px] desktop:text-[56px]",
          "tracking-[-0.04em] leading-[1.0] text-foreground text-center",
        )}
      >
        {project.title}
      </span>
    </div>
  );

  const card = (
    <TiltedCard
      imageSrc={project.cardImage}
      altText={project.title}
      containerHeight="100%"
      containerWidth="100%"
      rotateAmplitude={10}
      scaleOnHover={1.04}
      showTooltip={false}
      displayOverlayContent
      overlayContent={overlay}
      className="aspect-square overflow-hidden"
    />
  );

  // meta block under the card - title + summary + award. always visible so
  // visitors can scan a project's gist without hovering or clicking.
  const meta = (
    <div className="mt-4 tablet:mt-5 flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-sans font-medium text-[20px] tablet:text-[22px] tracking-[-0.04em] leading-[1.1]">
          {project.title}
        </span>
        {project.year && (
          <span className="font-sans text-[13px] font-normal text-muted-dark tabular-nums">
            {project.year}
          </span>
        )}
      </div>
      {project.summary && (
        <p className="font-sans text-[14px] tablet:text-[15px] font-normal leading-[1.45] tracking-[-0.01em] text-muted-dark max-w-[42ch]">
          {project.summary}
        </p>
      )}
      {project.award && (
        <p className="font-sans text-[12px] tablet:text-[13px] font-medium leading-[1.35] tracking-[-0.01em] text-muted-dark mt-0.5">
          {project.award}
        </p>
      )}
    </div>
  );

  const inner = (
    <>
      {card}
      {meta}
    </>
  );

  if (target.href === "#") return <div className="group block">{inner}</div>;
  if (target.external) {
    return (
      <a
        href={target.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        data-cursor-text="View"
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={target.href} className="group block" data-cursor-text="View">
      {inner}
    </Link>
  );
}

export default function WorksPage() {
  const yearRange = (() => {
    const years = projects.map((p) => p.year);
    return `${Math.min(...years)} - ${Math.max(...years)}`;
  })();
  // show every visible project - pre-sorted by month-year desc in data/projects.ts
  // (cards without a cardImage render with the styled text fallback in ImageCard)
  const grid = workGridProjects;

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1 pt-32 tablet:pt-[220px] relative z-10 bg-background">
        {/* hero - massive WORK type left, year tagline right */}
        <Section className="!pt-0 !pb-12 tablet:!pb-16">
          <Container>
            <div className="grid grid-cols-12 gap-6 tablet:gap-10 items-end">
              <div className="col-span-12 tablet:col-span-9">
                <MaskedLine className="pb-[6px] tablet:pb-[10px] desktop:pb-[14px]">
                  <DisplayHero>work.</DisplayHero>
                </MaskedLine>
              </div>
              <div className="col-span-12 tablet:col-span-3 tablet:text-right">
                <Appear variant="y-100-up" delay={0.16}>
                  <Caption className="font-mono text-muted-dark">
                    work {yearRange}
                  </Caption>
                </Appear>
              </div>
            </div>
          </Container>
        </Section>

        {/* 2-col image grid - all featured w/ card images */}
        <Section className="!pt-0">
          <Container>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-5 gap-y-12 tablet:gap-y-16">
              {grid.map((project) => (
                <ScrollReveal key={project.slug} variant="y175-up">
                  <ImageCard project={project} />
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
