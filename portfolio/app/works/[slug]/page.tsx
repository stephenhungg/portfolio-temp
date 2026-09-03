import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Section, Stack } from "@/components/layout";
import { Body, Caption } from "@/components/typography";
import { Appear } from "@/components/motion/Appear";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { caseStudyProjects, getProject, getRelatedProjects, projectDateIso } from "@/data/projects";
import type { Project } from "@/data/projects";
import { ProjectCardImage } from "@/components/ProjectCardImage";
import { site } from "@/data/site";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return caseStudyProjects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const url = `/works/${slug}`;
  // OG image auto-resolved from app/works/[slug]/opengraph-image.tsx — Next.js
  // picks it up by file convention. don't set images here or it overrides.
  return {
    title: project.title,
    description: project.summary,
    keywords: [project.title, ...project.stack, ...(project.tags || []), "Stephen Hung", "case study"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${project.title} - Stephen Hung`,
      description: project.summary,
      url,
      publishedTime: projectDateIso(project),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - Stephen Hung`,
      description: project.summary,
    },
  };
}

function MoreInStudios({ current }: { current: Project }) {
  const others = getRelatedProjects(current);
  if (others.length === 0) return null;
  return (
    <Section>
      <Container>
        <ScrollReveal variant="y-100-up">
          <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em] mb-6 tablet:mb-8 block">more work.</span>
        </ScrollReveal>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5">
          {others.map((project) => (
            <ScrollReveal key={project.slug} variant="y175-up">
              <Link href={`/works/${project.slug}`} className="group block">
                {project.cardImage && (
                  <ProjectCardImage
                    src={project.cardImage}
                    alt={project.title}
                    aspect="square"
                    sizes="(max-width: 810px) 100vw, 50vw"
                    title={project.title}
                  />
                )}
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.hasCaseStudy) notFound();

  const mod = await import(`@/content/case-studies/${slug}.mdx`);
  const MdxBody = mod.default as React.ComponentType;

  // JSON-LD: CreativeWork for the project + BreadcrumbList for nav context
  const SITE = site.url;
  const projectUrl = `${SITE}/works/${slug}`;
  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: projectUrl,
    author: { "@type": "Person", name: "Stephen Hung", url: SITE },
    creator: { "@type": "Person", name: "Stephen Hung", url: SITE },
    dateCreated: projectDateIso(project),
    keywords: [...project.stack, ...(project.tags || [])].join(", "),
    ...(project.cardImage ? { image: `${SITE}${project.cardImage}` } : {}),
    ...(project.award ? { award: project.award } : {}),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Works", item: `${SITE}/works` },
      { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Nav />
      <main id="main-content" className="flex-1 pt-32 tablet:pt-40 relative z-10 bg-background">
        {/* hero - 2-col: image left, title + meta right (per yuya measurements) */}
        <Section className="!pt-10 tablet:!pt-16">
          <Container>
            <div className="grid grid-cols-1 desktop:grid-cols-2 gap-6 tablet:gap-10 items-center">
              <div className="desktop:col-span-1">
                {project.cardImage ? (
                  <Appear variant="y175-up">
                    <div className="aspect-[4/3] bg-muted-light overflow-hidden relative">
                      <Image
                        src={project.cardImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1200px) 100vw, 600px"
                        priority
                        className="object-cover"
                      />
                    </div>
                  </Appear>
                ) : (
                  <div className="aspect-[4/3] bg-muted-light" />
                )}
              </div>
              <div className="desktop:col-span-1">
                <Stack size="lg">
                  <Appear variant="y-100-up" delay={0.08}>
                    <span className="font-sans font-normal text-[16px] text-muted-medium">
                      case study · {project.date ?? project.year}
                    </span>
                  </Appear>
                  <Appear variant="y175-up" delay={0.12}>
                    <h1 className="font-sans font-semibold leading-[0.9] tracking-[-0.06em] text-[56px] tablet:text-[80px] desktop:text-[110px]">
                      {project.title}
                    </h1>
                  </Appear>
                  <Appear variant="y-100-up" delay={0.18}>
                    <p className="font-sans font-medium text-[18px] tablet:text-[20px] leading-[1.5] tracking-[-0.02em] max-w-md">
                      {project.summary}
                    </p>
                  </Appear>
                  {project.tags?.[0] && (
                    <Appear variant="y-100-up" delay={0.24}>
                      {/* yuya meta pattern: 16px/400 caps, label + value at same size */}
                      <dl className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-6 mt-2 font-sans text-[16px] font-normal leading-[1.4]">
                        <dt className="text-muted-medium tracking-[-0.02em]">industry</dt>
                        <dd className="tracking-[-0.02em]">{project.tags[0]}</dd>
                        <dt className="text-muted-medium tracking-[-0.02em]">year</dt>
                        <dd className="tracking-[-0.02em]">{project.year}</dd>
                        {project.spine && (
                          <>
                            <dt className="text-muted-medium tracking-[-0.02em]">spine</dt>
                            <dd className="tracking-[-0.02em]">{project.spine}</dd>
                          </>
                        )}
                        {project.award && (
                          <>
                            <dt className="text-muted-medium tracking-[-0.02em]">award</dt>
                            <dd className="tracking-[-0.02em]">{project.award}</dd>
                          </>
                        )}
                      </dl>
                    </Appear>
                  )}
                </Stack>
              </div>
            </div>
          </Container>
        </Section>

        {/* full-width hero - prefer first screenshot, fallback to cardImage */}
        {(project.screenshots?.[0] || project.cardImage) && (
          <Section className="!py-6 tablet:!py-10">
            <Container>
              <ScrollReveal variant="y175-up">
                <div className="aspect-[16/8] bg-muted-light overflow-hidden relative">
                  <Image
                    src={project.screenshots?.[0] || project.cardImage!}
                    alt={`${project.title} hero`}
                    fill
                    sizes="(max-width: 1440px) 100vw, 1280px"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
            </Container>
          </Section>
        )}

        {/* body - about / challenge / results sections */}
        <Section>
          <Container>
            <ScrollReveal variant="y175-up">
              <article className="prose-yuya">
                <div className="grid grid-cols-1 tablet:grid-cols-12 gap-6 tablet:gap-10 mb-12 tablet:mb-16">
                  <div className="tablet:col-span-3">
                    <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em]">about.</span>
                  </div>
                  <div className="tablet:col-span-8 tablet:col-start-5">
                    <p className="font-sans font-medium text-foreground text-[18px] tablet:text-[20px] leading-[1.5] tracking-[-0.02em]">
                      {project.summary}
                    </p>
                  </div>
                </div>

                {MdxBody && (
                  <div className="grid grid-cols-1 tablet:grid-cols-12 gap-6 tablet:gap-10 mb-12 tablet:mb-16">
                    <div className="tablet:col-span-3">
                      <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em]">challenge.</span>
                    </div>
                    <div className="tablet:col-span-8 tablet:col-start-5">
                      <MdxBody />
                    </div>
                  </div>
                )}

                {/* gallery - render real screenshots when available, fallback to duplicate cardImage */}
                {project.screenshots && project.screenshots.length > 1 ? (
                  <ScrollReveal variant="y175-up">
                    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5 mb-12 tablet:mb-16">
                      {project.screenshots.slice(1).map((src, idx) => (
                        <div key={src} className="aspect-[16/10] bg-muted-light overflow-hidden relative">
                          <Image
                            src={src}
                            alt={`${project.title} screenshot ${idx + 2}`}
                            fill
                            sizes="(max-width: 810px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                ) : project.cardImage ? (
                  <ScrollReveal variant="y175-up">
                    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-5 mb-12 tablet:mb-16">
                      <div className="aspect-square bg-muted-light overflow-hidden relative">
                        <Image
                          src={project.cardImage}
                          alt={`${project.title} detail`}
                          fill
                          sizes="(max-width: 810px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="aspect-square bg-muted-light overflow-hidden relative">
                        <Image
                          src={project.cardImage}
                          alt={`${project.title} detail`}
                          fill
                          sizes="(max-width: 810px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </ScrollReveal>
                ) : null}

                {/* stack + links */}
                <div className="grid grid-cols-1 tablet:grid-cols-12 gap-6 tablet:gap-10 mt-12 tablet:mt-16 pt-10 border-t border-muted-light">
                  <div className="tablet:col-span-3">
                    <span className="font-sans text-[24px] tablet:text-[30px] font-medium tracking-[-0.04em]">stack.</span>
                  </div>
                  <div className="tablet:col-span-8 tablet:col-start-5">
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span key={item} className="px-3 py-1.5 bg-muted-light font-sans text-[14px] font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                    {(project.links?.live || project.links?.original || project.links?.repo) && (
                      <Stack size="xs" className="text-[14px] mt-6">
                        {project.links?.live && (
                          <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 hover:text-muted-medium">
                            live →
                          </a>
                        )}
                        {project.links?.original && (
                          <a href={project.links.original} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 hover:text-muted-medium">
                            original →
                          </a>
                        )}
                        {project.links?.repo && (
                          <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 hover:text-muted-medium">
                            repo →
                          </a>
                        )}
                      </Stack>
                    )}
                  </div>
                </div>
              </article>
            </ScrollReveal>
          </Container>
        </Section>

        <MoreInStudios current={project} />
      </main>
      <Footer />
    </>
  );
}
