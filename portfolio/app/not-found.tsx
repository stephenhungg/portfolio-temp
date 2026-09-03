import Link from "next/link";
import { Container, Section, Stack } from "@/components/layout";
import { DisplayLarge, Body, Eyebrow } from "@/components/typography";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1 pt-32 tablet:pt-40 flex items-center relative z-10 bg-background">
        <Section>
          <Container>
            <Stack size="2xl" className="max-w-2xl">
              <Eyebrow className="text-muted-medium font-mono">404.</Eyebrow>
              <DisplayLarge>page not found</DisplayLarge>
              <Body className="text-muted-dark">
                that route doesn&rsquo;t exist. could be an old framer slug i didn&rsquo;t catch,
                or a typo. try{" "}
                <Link href="/works" className="underline hover:text-muted-medium">
                  /works
                </Link>
                {" "}or head{" "}
                <Link href="/" className="underline hover:text-muted-medium">
                  home
                </Link>
                .
              </Body>
            </Stack>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
