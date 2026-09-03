import type { Metadata } from "next";
import { Inter, Fragment_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Loader } from "@/components/Loader";
import { LoaderProvider } from "@/lib/loader-state";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const SITE_URL = site.url;
const SITE_NAME = site.name;
const SITE_DESCRIPTION = site.description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s - Stephen Hung",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "Stephen Hung",
    "stpnhh",
    "full-stack developer",
    "ai agents",
    "agents engineer",
    "real-time interfaces",
    "Berkeley EECS",
    "Next.js",
    "React",
    "TypeScript",
    "FastAPI",
    "GSAP",
    "Three.js",
    "LiveKit",
    "ElevenLabs",
    "Claude",
    "Gemini",
    "product engineer",
    "portfolio",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: "@stpnhh",
    site: "@stpnhh",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // file-based icons handled by app/icon.tsx + app/apple-icon.tsx (auto-detected)
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
};

// JSON-LD Person schema - helps Google understand the site is about a person
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Stephen Hung",
  alternateName: "stpnhh",
  url: SITE_URL,
  email: `mailto:${site.email}`,
  description: SITE_DESCRIPTION,
  jobTitle: site.role,
  affiliation: {
    "@type": "EducationalOrganization",
    name: "University of California, Berkeley",
    sameAs: "https://www.berkeley.edu/",
  },
  sameAs: [
    site.socials.linkedin,
    site.socials.x,
    site.socials.github,
  ],
  knowsAbout: [
    "AI agents",
    "Real-time systems",
    "Full-stack development",
    "Next.js",
    "React",
    "TypeScript",
    "FastAPI",
    "Computer vision",
    "Voice interfaces",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fragmentMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="skip-link"
        >
          skip to content
        </a>
        <LoaderProvider>
          <SmoothScroll />
          {children}
          <Loader
            images={[
              "/images/loader/loader-01.jpg",
              "/images/loader/loader-02.jpg",
              "/images/loader/loader-03.jpg",
            ]}
          />
          <Cursor />
        </LoaderProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
