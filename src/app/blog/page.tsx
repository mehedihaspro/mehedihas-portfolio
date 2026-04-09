import type { Metadata } from "next";
import { BlogPageClient } from "./blog-page-client";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on design, creativity, and building products.",
};

// Sample data — will be replaced with Sanity queries
const SAMPLE_POSTS = [
  {
    slug: "duolingo-streak-psychology",
    title: "Duolingo এর সবুজ পাখি কেন আপনাকে ছাড়ে না — Gamification Psychology",
    excerpt:
      "কেন আমরা streak হারাতে ভয় পাই? কীভাবে Duolingo আমাদের brain এর reward system কে hack করে? একটা deep dive into behavioral design।",
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
  {
    slug: "micro-interactions-that-matter",
    title: "Micro-interactions যেগুলো User Experience বদলে দেয়",
    excerpt:
      "ছোট ছোট animation আর feedback যেগুলো product কে alive করে তোলে। Real-world examples সহ।",
    category: "UX Design",
    date: "Feb 22, 2026",
    readingTime: "7 min read",
    hasAudio: true,
    coverColor: "bg-[#4A3F6B]",
  },
  {
    slug: "building-design-portfolio",
    title: "আপনার Design Portfolio কেন আপনাকে job পাচ্ছে না",
    excerpt:
      "Portfolio review করতে গিয়ে বারবার যে mistakes দেখি — এবং কীভাবে ঠিক করবেন।",
    category: "Career",
    date: "Feb 10, 2026",
    readingTime: "6 min read",
    hasAudio: false,
    coverColor: "bg-[#6B4A4A]",
  },
  {
    slug: "color-theory-practical-guide",
    title: "Color Theory — Designer দের জন্য Practical Guide",
    excerpt:
      "শুধু theory না, real project এ color কীভাবে ব্যবহার করবেন তার hands-on guide।",
    category: "Visual Design",
    date: "Jan 28, 2026",
    readingTime: "10 min read",
    hasAudio: true,
    coverColor: "bg-[#C48A1A]",
  },
  {
    slug: "design-thinking-beyond-workshop",
    title: "Design Thinking — Workshop এর বাইরেও কাজ করে?",
    excerpt:
      "Design thinking কি শুধুই sticky notes আর whiteboard? নাকি এটা সত্যিকারের problem-solving framework?",
    category: "Design Psychology",
    date: "Jan 15, 2026",
    readingTime: "9 min read",
    hasAudio: false,
    coverColor: "bg-[#2E4A6B]",
  },
];

const CATEGORIES = [
  "Design Psychology",
  "Design System",
  "UX Design",
  "Visual Design",
  "Career",
];

export default function BlogPage() {
  return <BlogPageClient posts={SAMPLE_POSTS} categories={CATEGORIES} />;
}
