import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { postBySlugQuery, authorQuery } from "@/lib/sanity/queries";
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

interface Block {
  _type: string;
  style?: string;
  _key: string;
  children?: Array<{ text: string }>;
}

function extractTocFromBody(body: Block[]) {
  if (!body) return [];
  return body
    .filter(
      (block) =>
        block._type === "block" && (block.style === "h2" || block.style === "h3")
    )
    .map((block) => ({
      id: slugify(block.children?.map((c) => c.text).join("") || ""),
      text: block.children?.map((c) => c.text).join("") || "",
      level: block.style === "h3" ? 3 : 2,
    }));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09ff\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

function extractPlainText(body: Block[]): string {
  if (!body) return "";
  return body
    .filter((block) => block._type === "block")
    .map((block) => block.children?.map((c) => c.text).join("") || "")
    .filter(Boolean)
    .join("\n\n");
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await sanityClient.fetch(postBySlugQuery, { slug });
    if (post) {
      return {
        title: post.title,
        description: post.excerpt || post.summary || "",
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
  let sanityAuthor: { name?: string; avatar?: { url?: string } } | null = null;
  try {
    [sanityPost, sanityAuthor] = await Promise.all([
      sanityClient.fetch(postBySlugQuery, { slug }),
      sanityClient.fetch(authorQuery),
    ]);
  } catch {
    // Fetch failed
  }

  if (!sanityPost) {
    notFound();
  }

  const tocItems = extractTocFromBody(sanityPost.body);
  const plainText = extractPlainText(sanityPost.body);

  const post = {
    title: sanityPost.title,
    summary: sanityPost.summary || sanityPost.excerpt,
    category: sanityPost.category || "Design",
    date: formatDate(sanityPost.publishedAt),
    readingTime: sanityPost.readingTime || "5 min read",
    author: sanityAuthor?.name || "mehedihas",
    authorAvatar: sanityAuthor?.avatar?.url || "",
    hasAudio: sanityPost.enableAudio || false,
    audioDuration: sanityPost.audioDuration,
    language: sanityPost.language || "BANGLA",
    coverImage: sanityPost.coverImage?.url || "",
    coverImageAlt: sanityPost.coverImage?.alt || "",
    coverImageWidth: sanityPost.coverImage?.width,
    coverImageHeight: sanityPost.coverImage?.height,
    coverImageLqip: sanityPost.coverImage?.lqip || "",
    tocItems,
    body: sanityPost.body || [],
    plainText,
    references: sanityPost.references || [],
    factChecks: sanityPost.factChecks || [],
    relatedPosts: sanityPost.relatedPosts || [],
    quiz: sanityPost.quiz,
  };

  return <BlogPostClient post={post} slug={slug} />;
}
