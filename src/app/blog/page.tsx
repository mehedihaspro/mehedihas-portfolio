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
    title: "Figma Variables দিয়ে Design System তৈরি — Complete Guide",
    excerpt:
      "Variables, modes, collections — সব কিছু একজায়গায়। কীভাবে একটা scalable design system তৈরি করবেন Figma তে, practical examples সহ step-by-step guide।",
    category: "Design System",
    date: "March 15, 2026",
    readingTime: "12 min read",
    hasAudio: true,
    language: "BANGLA",
  },
  {
    slug: "designers-should-write",
    title: "ডিজাইনারদের কেন লেখালেখি করা উচিত?",
    excerpt:
      "Writing শুধু content creators এর জন্য না। একজন designer হিসেবে লেখালেখি আপনার thinking sharpen করে, communication improve করে, আর আপনাকে industry তে visible করে।",
    category: "Career",
    date: "March 5, 2026",
    readingTime: "5 min read",
    hasAudio: false,
    language: "BANGLA",
  },
  {
    slug: "micro-interactions-that-matter",
    title: "Micro-interactions যেগুলো User Experience বদলে দেয়",
    excerpt:
      "ছোট ছোট animation আর feedback যেগুলো product কে alive করে তোলে। Real-world examples সহ কীভাবে meaningful micro-interactions design করবেন।",
    category: "UX Design",
    date: "February 22, 2026",
    readingTime: "7 min read",
    hasAudio: true,
    language: "BANGLA",
  },
  {
    slug: "design-portfolio-mistakes",
    title: "আপনার Design Portfolio কেন আপনাকে job পাচ্ছে না",
    excerpt:
      "Portfolio review করতে গিয়ে বারবার যে mistakes দেখি — এবং কীভাবে ঠিক করবেন। Recruiter রা আসলে কী দেখে আর কী skip করে।",
    category: "Career",
    date: "February 10, 2026",
    readingTime: "6 min read",
    hasAudio: false,
    language: "BANGLA",
  },
  {
    slug: "color-theory-practical-guide",
    title: "Color Theory — Designer দের জন্য Practical Guide",
    excerpt:
      "শুধু theory না, real project এ color কীভাবে ব্যবহার করবেন তার hands-on guide। Contrast, accessibility, আর emotional impact সব কিছু।",
    category: "Visual Design",
    date: "January 28, 2026",
    readingTime: "10 min read",
    hasAudio: true,
    language: "BANGLA",
  },
  {
    slug: "why-design-thinking-works",
    title: "Design Thinking — Workshop এর বাইরেও কাজ করে?",
    excerpt:
      "Design thinking কি শুধুই sticky notes আর whiteboard? নাকি এটা সত্যিকারের problem-solving framework যা everyday decision-making এও কাজ করে?",
    category: "UX Psychology",
    date: "January 15, 2026",
    readingTime: "9 min read",
    hasAudio: false,
    language: "BANGLA",
  },
  {
    slug: "what-makes-good-ux-writing",
    title: "What Makes Good UX Writing? A Practical Breakdown",
    excerpt:
      "Every word in your interface is a design decision. Learn how to write microcopy that guides users, reduces friction, and builds trust — with real examples from top products.",
    category: "UX Design",
    date: "January 5, 2026",
    readingTime: "7 min read",
    hasAudio: true,
    language: "ENGLISH",
  },
  {
    slug: "design-systems-at-scale",
    title: "Building Design Systems That Actually Scale",
    excerpt:
      "Most design systems fail not because of bad components, but because of bad governance. Here's what I learned building systems for teams of 10 to 100 designers.",
    category: "Design System",
    date: "December 20, 2025",
    readingTime: "11 min read",
    hasAudio: false,
    language: "ENGLISH",
  },
  {
    slug: "accessibility-not-afterthought",
    title: "Accessibility Is Not an Afterthought — It's a Design Skill",
    excerpt:
      "If you're adding accessibility at the end of your design process, you're doing it wrong. Here's how to bake it in from day one, and why it makes your designs better for everyone.",
    category: "UX Design",
    date: "December 10, 2025",
    readingTime: "8 min read",
    hasAudio: true,
    language: "ENGLISH",
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

  // Use demo content if Sanity has fewer than 3 posts (for preview purposes)
  const displayPosts = posts.length >= 3 ? posts : DEMO_POSTS;
  const displayCategories =
    categories.length > 0
      ? categories
      : ["UX Psychology", "Design System", "Career"];

  return <BlogPageClient posts={displayPosts} categories={displayCategories} />;
}
