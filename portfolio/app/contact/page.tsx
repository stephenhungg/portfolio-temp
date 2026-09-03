import type { Metadata } from "next";
import { Container, Section, Stack } from "@/components/layout";
import { DisplayHeroText } from "@/components/typography";
import { MaskedLine } from "@/components/motion/MaskedLine";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { CopyEmail } from "@/components/CopyEmail";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Stephen Hung. Open to collaborations, freelance, and full-time roles.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact - Stephen Hung",
    description: "Open to collaborations, freelance, and full-time roles.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1 pt-32 tablet:pt-[220px] relative z-10 bg-background">
        {/* hero - massive SHOOT A REQUEST */}
        <Section className="!pt-0 !pb-12 tablet:!pb-16">
          <Container>
            <h1>
              <Stack size="xs">
              <MaskedLine className="pb-[6px] tablet:pb-[10px] desktop:pb-[14px]">
                <DisplayHeroText className="!font-bold">shoot a</DisplayHeroText>
              </MaskedLine>
              <MaskedLine className="pb-[6px] tablet:pb-[10px] desktop:pb-[14px]">
                <DisplayHeroText className="!font-bold">request.</DisplayHeroText>
              </MaskedLine>
              </Stack>
            </h1>
          </Container>
        </Section>

        {/* email left, form right */}
        <Section>
          <Container>
            <div className="grid grid-cols-1 desktop:grid-cols-12 gap-10 desktop:gap-16">
              <div className="desktop:col-span-4">
                <ScrollReveal variant="y-100-up">
                  <CopyEmail email={site.email} size="lg" />
                </ScrollReveal>
              </div>
              <div className="desktop:col-span-7 desktop:col-start-6">
                <ScrollReveal variant="y175-up">
                  <ContactForm />
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
