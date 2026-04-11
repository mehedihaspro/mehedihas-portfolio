import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { groq } from "next-sanity";

const SITE_URL = "https://mehedihas.pro";

const sitemapPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  }
`;

const sitemapProjectsQuery = groq`
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;

type PostEntry = { slug: string; publishedAt?: string; _updatedAt?: string };
type ProjectEntry = { slug: string; _updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/workshops`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  let posts: PostEntry[] = [];
  let projects: ProjectEntry[] = [];

  try {
    [posts, projects] = await Promise.all([
      sanityClient.fetch<PostEntry[]>(sitemapPostsQuery),
      sanityClient.fetch<ProjectEntry[]>(sitemapProjectsQuery),
    ]);
  } catch {
    // Sanity not reachable at build time — return static routes only
  }

  const postRoutes: MetadataRoute.Sitemap = (posts || []).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p._updatedAt || p.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    lastModified: p._updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
