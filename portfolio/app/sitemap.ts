import type { MetadataRoute } from "next";
import { caseStudyProjects, projectDateIso } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: site.updatedAt,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${site.url}/works`,
      lastModified: site.updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/about`,
      lastModified: site.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/contact`,
      lastModified: site.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...caseStudyProjects.map((project) => ({
      url: `${site.url}/works/${project.slug}`,
      lastModified: projectDateIso(project),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
