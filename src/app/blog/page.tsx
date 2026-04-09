import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { allPostsQuery, categoriesQuery } from "@/lib/sanity/queries";
import { BlogPageClient } from "./blog-page-client";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on design, creativity, and building products.",
};

// Revalidate every 60 seconds so new Sanity content appears quickly
export const revalidate = 60;

// Sample data — shown when Sanity has no posts yet
const SAMPLE_POSTS = [
  {
    slug: "duolingo-streak-psychology",
    title: "Duolingo এর সবুজ পাখি কেন আপনাকে ছাড়ে না — Gamification Psychology",
    excerpt:
      "কেন আমরা streak হারাতে ভয় পাই? কীভাবে Duolingo আমাদের brain এর reward system কে hack করে?",
    category: "Design Psychology",
    date: "Mar 28, 2026",
    readingTime: "8 min read",
    hasAudio: true,
    coverColor: "bg-[#2D5F2D]",
  },
  {
    slug: "figma-variables-complete-guide",
    title: "Figma Variables দিয়ে Design System তৈরি — Complete Guide",
    excerpt:
      "Variables, modes, collections — সব কিছু একজায়গায়। Practical examples সহ step-by-step guide।",
    category: "Design System",
    date: "Mar 15, 2026",
    readingTime: "12 min read",
    hasAudio: true,
    coverColor: "bg-[#1E1E2E]",
  },
  {
    slug: "why-designers-should-write",
    title: "ডিজাইনারদের কেন লেখালেখি করা উচিত?",
    excerpt:
      "Writing শুধু content creators এর জন্য না। একজন designer হিসেবে লেখালেখি আপনার thinking sharpen করে।",
    category: "Career",
    date: "Mar 5, 2026",
    readingTime: "5 min read",
    hasAudio: false,
    coverColor: "bg-[#8B6B4A]",
  },
];

const SAMPLE_CATEGORIES = [
  "Design Psychology",
  "Design System",
  "UX Design",
  "Visual Design",
  "Career",
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  let posts;
  let categories;

  try {
    const sanityPosts = await sanityClient.fetch(allPostsQuery);
    const sanityCategories = await sanityClient.fetch(categoriesQuery);

    if (sanityPosts && sanityPosts.length > 0) {
      // Transform Sanity data to match our component format
      posts = sanityPosts.map((post: {
        slug: { current: string };
        title: string;
        excerpt: string;
        category: string;
        publishedAt: string;
        readingTime: string;
        audioUrl: string;
        coverColor: string;
      }) => ({
        slug: post.slug.current,
        title: post.title,
        excerpt: post.excerpt || "",
        category: post.category,
        date: formatDate(post.publishedAt),
        readingTime: post.readingTime || "5 min read",
        hasAudio: !!post.audioUrl,
        coverColor: post.coverColor ? `bg-[${post.coverColor}]` : "bg-bg-subtle",
      }));
      categories = sanityCategories.filter(Boolean);
    } else {
      // Fallback to sample data
      posts = SAMPLE_POSTS;
      categories = SAMPLE_CATEGORIES;
    }
  } catch {
    // If Sanity fetch fails, use sample data
    posts = SAMPLE_POSTS;
    categories = SAMPLE_CATEGORIES;
  }

  return <BlogPageClient posts={posts} categories={categories} />;
}
