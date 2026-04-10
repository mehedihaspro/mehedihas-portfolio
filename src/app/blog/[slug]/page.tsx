import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { postBySlugQuery } from "@/lib/sanity/queries";
import { BlogPostClient } from "./blog-post-client";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function extractTocFromBody(body: Array<{ _type: string; style?: string; _key: string; children?: Array<{ text: string }> }>) {
  if (!body) return [];
  return body
    .filter((block) => block._type === "block" && (block.style === "h2" || block.style === "h3"))
    .map((block) => ({
      id: block._key,
      text: block.children?.map((c) => c.text).join("") || "",
      level: block.style === "h3" ? 3 : 2,
    }));
}

function extractSectionsFromBody(body: Array<{ _type: string; style?: string; _key: string; children?: Array<{ text: string }> }>) {
  if (!body) return [];

  const sections: Array<{ id: string; heading: string; content: string }> = [];
  let currentSection: { id: string; heading: string; paragraphs: string[] } | null = null;

  for (const block of body) {
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      if (currentSection) {
        sections.push({
          id: currentSection.id,
          heading: currentSection.heading,
          content: currentSection.paragraphs.join("\n\n"),
        });
      }
      const text = block.children?.map((c) => c.text).join("") || "";
      currentSection = { id: block._key, heading: text, paragraphs: [] };
    } else if (block._type === "block" && currentSection) {
      const text = block.children?.map((c) => c.text).join("") || "";
      if (text.trim()) currentSection.paragraphs.push(text);
    } else if (block._type === "block" && !currentSection) {
      const text = block.children?.map((c) => c.text).join("") || "";
      if (text.trim()) {
        currentSection = { id: "intro", heading: "Introduction", paragraphs: [text] };
      }
    }
  }

  if (currentSection) {
    sections.push({
      id: currentSection.id,
      heading: currentSection.heading,
      content: currentSection.paragraphs.join("\n\n"),
    });
  }

  return sections;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await sanityClient.fetch(postBySlugQuery, { slug });
    if (post) {
      return {
        title: post.title,
        description: post.excerpt || "",
      };
    }
  } catch {
    // Fall through
  }

  return { title: "Post not found" };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let sanityPost;
  try {
    sanityPost = await sanityClient.fetch(postBySlugQuery, { slug });
  } catch {
    // Fetch failed
  }

  if (!sanityPost) {
    notFound();
  }

  const tocItems = extractTocFromBody(sanityPost.body);
  const sections = extractSectionsFromBody(sanityPost.body);

  const post = {
    title: sanityPost.title,
    category: sanityPost.category || "Design",
    date: formatDate(sanityPost.publishedAt),
    readingTime: sanityPost.readingTime || "5 min read",
    author: "mehedihas",
    hasAudio: !!sanityPost.audioUrl,
    audioDuration: sanityPost.audioDuration || "0:00",
    coverColor: sanityPost.coverColor ? `bg-[${sanityPost.coverColor}]` : "bg-bg-subtle",
    tocItems,
    sections,
  };

  return <BlogPostClient post={post} slug={slug} />;
}
