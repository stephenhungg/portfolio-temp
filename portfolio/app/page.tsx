import Link from "next/link";
import Image from "next/image";
import { Container, Section, Stack } from "@/components/layout";
import { DisplayHeroText } from "@/components/typography";
import { Appear } from "@/components/motion/Appear";
import { MaskedLine } from "@/components/motion/MaskedLine";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PillLink } from "@/components/Pill";
import { site } from "@/data/site";
import { CopyEmail } from "@/components/CopyEmail";
import { InfiniteCarousel } from "@/components/InfiniteCarousel";
import { caseStudyProjects } from "@/data/projects";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1 pt-[110px] tablet:pt-[120px] relative z-10 bg-background">
        {/* hero - fills viewport: name at top, email/bio anchored at bottom */}
        <Section className="!pt-5 !pb-10 tablet:!pb-12 min-h-[calc(100vh-110px)] tablet:min-h-[calc(100vh-120px)] flex flex-col">
          <Container className="flex flex-col flex-1">
            {/* top: name massive left, portrait top right */}
            <div className="grid grid-cols-12 gap-6 tablet:gap-10 items-start">
              <div className="col-span-12 tablet:col-span-10">
                <h1>
                  <Stack size="xs">
                  <MaskedLine className="pb-[6px] tablet:pb-[10px] desktop:pb-[14px]">
                    <DisplayHeroText>stephen</DisplayHeroText>
                  </MaskedLine>
                  <MaskedLine className="pb-[6px] tablet:pb-[10px] desktop:pb-[14px]">
                    <DisplayHeroText>hung.</DisplayHeroText>
                  </MaskedLine>
                  </Stack>
                </h1>
              </div>
              <div className="hidden tablet:flex col-span-2 justify-end items-start">
                <Appear variant="scale-in" delay={0.16}>
                  <div className="relative aspect-square w-[120px] desktop:w-[168px] rounded-full overflow-hidden bg-muted-light">
                    <Image
                      src="/images/portrait.webp"
                      alt="Stephen Hung"
                      fill
                      sizes="168px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </Appear>
              </div>
            </div>

            {/* spacer pushes sub-row to viewport bottom */}
            <div className="flex-1 min-h-[120px] tablet:min-h-[180px]" />

            {/* bottom: email left, bio right */}
            <div className="grid grid-cols-12 gap-6 tablet:gap-10 items-start">
              <div className="col-span-12 tablet:col-span-5">
                <Appear variant="y175-up" delay={0.2}>
                  <div className="flex flex-col items-start">
                    <CopyEmail email={site.email} size="lg" />
                    <Link
                      href={site.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center font-sans text-[16px] font-medium yuya-link"
                    >
                      cv ↗
                    </Link>
                  </div>
                </Appear>
              </div>
              <div className="col-span-12 tablet:col-span-7 tablet:col-start-6">
                <Appear variant="y265-up" delay={0.26}>
                  <p className="font-sans text-foreground text-[24px] tablet:text-[32px] desktop:text-[40px] font-medium leading-[1.2] tracking-[-0.06em]">
                    {site.headline}
                  </p>
                </Appear>
              </div>
            </div>
          </Container>
        </Section>

        {/* work - eyebrow + show more + button-driven infinite carousel
            (replaces the previous 2x2 grid which was glitchy) */}
        <Section className="!pt-[80px] tablet:!pt-[100px]">
          <Container>
            <div className="flex items-center justify-between mb-8 tablet:mb-10">
              <ScrollReveal variant="y-100-up">
                <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em]">work.</span>
              </ScrollReveal>
              <ScrollReveal variant="y-100-up">
                <PillLink href="/works">show more</PillLink>
              </ScrollReveal>
            </div>
            <InfiniteCarousel
              cards={caseStudyProjects.map((p) => ({
                slug: p.slug,
                title: p.title,
                image: p.cardImage,
                href: p.hasCaseStudy ? `/works/${p.slug}` : (p.links?.live || p.links?.original || p.links?.repo || `/works/${p.slug}`),
              }))}
            />
          </Container>
        </Section>

        {/* about teaser - eyebrow + show more + bio */}
        <Section className="!pt-[80px] tablet:!pt-[100px]">
          <Container>
            <div className="flex items-center justify-between mb-8 tablet:mb-10">
              <ScrollReveal variant="y-100-up">
                <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em]">about.</span>
              </ScrollReveal>
              <ScrollReveal variant="y-100-up">
                <PillLink href="/about">show more</PillLink>
              </ScrollReveal>
            </div>
            {/* big bio: left half (col-span 6) - yuya pattern */}
            <div className="grid grid-cols-1 tablet:grid-cols-12 gap-6 tablet:gap-10">
              <div className="col-span-12 tablet:col-span-6">
                <ScrollReveal variant="y175-up">
                  <p className="font-sans font-medium leading-[1.15] tracking-[-0.06em] text-[34px] tablet:text-[44px] desktop:text-[50px]">
                    {site.bio}
                  </p>
                </ScrollReveal>
              </div>
            </div>

            {/* image (col-start-3 col-span-5, biased center-left) + subtext to the right (col-start-9 col-span-3, vertically centered) */}
            <div className="mt-12 tablet:mt-16 grid grid-cols-1 tablet:grid-cols-12 gap-6 tablet:gap-10 items-center">
              <div className="tablet:col-start-3 tablet:col-span-5">
                <ScrollReveal variant="y175-up">
                  <div className="relative aspect-[4/3] bg-muted-light overflow-hidden">
                    <Image
                      src="/images/gallery-1.webp"
                      alt="Stephen Hung at Y Combinator"
                      fill
                      sizes="(max-width: 1200px) 100vw, 600px"
                      className="object-cover object-[62%_center]"
                    />
                  </div>
                </ScrollReveal>
              </div>
              <div className="tablet:col-span-3 tablet:col-start-9">
                <ScrollReveal variant="y175-up">
                  <p className="font-sans font-medium text-[18px] tablet:text-[20px] leading-[1.3] tracking-[-0.04em]">
                    {site.bioDetail}
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
