import type { NextConfig } from "next";
import createMdx from "@next/mdx";

const withMdx = createMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [],
  },
});

// legacy framer source-slug redirects, preserved from the old framer mirror
// deployment so existing inbound links keep working.
const legacyProjectSlugRedirects = [
  { source: "stone-mind", destination: "opal" },
  { source: "violet-orbit", destination: "darwin" },
  { source: "visual-screen-models", destination: "bip" },
  { source: "flexible-area-models", destination: "clarifai" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return legacyProjectSlugRedirects.flatMap(({ source, destination }) => [
      {
        source: `/works/${source}`,
        destination: `/works/${destination}`,
        permanent: true,
      },
      {
        source: `/works/${source}/`,
        destination: `/works/${destination}`,
        permanent: true,
      },
    ]);
  },
};

export default withMdx(nextConfig);
