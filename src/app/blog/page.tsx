import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { allPostsQuery, categoriesQuery } from "@/lib/sanity/queries";
import { BlogPageClient } from "./blog-page-client";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on design, creativity, and building products.",
};

export const revalidate = 60;

// Demo content — shown when Sanity is empty
const DEMO_POSTS = [
  {
    slug: "duolingo-streak-psychology",
    title: "Duolingo এর সবুজ পাখি কেন আপনাকে ছাড়ে না",
    excerpt:
      'Duolingo র সবুজ পাখিটা আপনাকে প্রতিদিন মনে করিয়ে দেয়, "আজ পড়াশোনা হয়নি।" কিন্তু এই innocent reminder এর পেছনে loss aversion, Zeigarnik Effect, আর guilt-driven design এর একটা পুরো system কাজ করছে।',
    category: "UX Psychology",
    date: "March 28, 2026",
    readingTime: "8 min read",
    hasAudio: true,
    language: "BANGLA",
  },
  {
    slug: "figma-variables-design-system",
    title: "Duolingo এর সবুজ পাখি কেন আপনাকে ছাড়ে না",
    excerpt:
      'Duolingo র সবুজ পাখিটা আপনাকে প্রতিদিন মনে করিয়ে দেয়, "আজ পড়াশোনা হয়নি।" কিন্তু এই innocent reminder এর পেছনে loss aversion, Zeigarnik Effect, আর guilt-driven design এর একটা পুরো system কাজ করছে।',
    category: "UX Psychology",
    date: "March 28, 2026",
    readingTime: "8 min read",
    hasAudio: true,
    language: "BANGLA",
  },
  {
    slug: "designers-should-write",
    title: "Duolingo এর সবুজ পাখি কেন আপনাকে ছাড়ে না",
    excerpt:
      'Duolingo র সবুজ পাখিটা আপনাকে প্রতিদিন মনে করিয়ে দেয়, "আজ পড়াশোনা হয়নি।" কিন্তু এই innocent reminder এর পেছনে loss aversion, Zeigarnik Effect, আর guilt-driven design এর একটা পুরো system কাজ করছে।',
    category: "UX Psychology",
    date: "March 28, 2026",
    readingTime: "8 min read",
    hasAudio: true,
    language: "BANGLA",
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  let posts = [];
  let categories: string[] = [];

  try {
    const sanityPosts = await sanityClient.fetch(allPostsQuery);
    const sanityCategories = await sanityClient.fetch(categoriesQuery);

    if (sanityPosts && sanityPosts.length > 0) {
      posts = sanityPosts.map(
        (post: {
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
          coverColor: post.coverColor
            ? `bg-[${post.coverColor}]`
            : "bg-bg-subtle",
          language: "BANGLA",
        })
      );
      categories = (sanityCategories || []).filter(Boolean);
    }
  } catch {
    // Sanity fetch failed
  }

  // Use demo content if no Sanity posts
  const displayPosts = posts.length > 0 ? posts : DEMO_POSTS;
  const displayCategories =
    categories.length > 0
      ? categories
      : ["UX Psychology", "Design System", "Career"];

  return <BlogPageClient posts={displayPosts} categories={displayCategories} />;
}
