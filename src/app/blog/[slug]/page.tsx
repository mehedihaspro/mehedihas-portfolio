import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { postBySlugQuery } from "@/lib/sanity/queries";
import { BlogPostClient } from "./blog-post-client";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// Sample post for fallback
const SAMPLE_POST = {
  title: "Duolingo এর সবুজ পাখি কেন আপনাকে ছাড়ে না — Gamification Psychology",
  category: "Design Psychology",
  date: "March 28, 2026",
  readingTime: "8 min read",
  author: "mehedihas",
  hasAudio: true,
  audioDuration: "8:32",
  coverColor: "bg-[#2D5F2D]",
  tocItems: [
    { id: "intro", text: "Introduction", level: 2 },
    { id: "streak-psychology", text: "Streak Psychology", level: 2 },
    { id: "loss-aversion", text: "Loss Aversion কীভাবে কাজ করে", level: 3 },
    { id: "variable-rewards", text: "Variable Rewards", level: 2 },
    { id: "social-proof", text: "Social Proof & Competition", level: 2 },
    { id: "dark-patterns", text: "Dark Patterns নাকি Good Design?", level: 2 },
    { id: "takeaway", text: "Takeaway for Designers", level: 2 },
  ],
  sections: [
    {
      id: "intro",
      heading: "Introduction",
      content: `আপনি কি কখনো ভেবে দেখেছেন কেন Duolingo এর সবুজ পাখি আপনাকে এতটা guilty feel করায় যখন আপনি একদিন practice মিস করেন?

এটা কোনো coincidence না। এটা carefully designed behavioral psychology যা আপনার brain এর deepest reward mechanisms কে target করে।`,
    },
    {
      id: "streak-psychology",
      heading: "Streak Psychology",
      content: `Streak হলো Duolingo এর সবচেয়ে powerful retention tool। একটা simple counter যা বলে আপনি কতদিন consecutively practice করেছেন।

যখন আপনার 30-day streak আছে, আপনি শুধু একটা number দেখছেন না — আপনি 30 দিনের investment দেখছেন।`,
    },
    {
      id: "loss-aversion",
      heading: "Loss Aversion কীভাবে কাজ করে",
      content: `Daniel Kahneman এবং Amos Tversky এর research থেকে আমরা জানি যে মানুষ loss কে gain এর চেয়ে প্রায় দ্বিগুণ strongly feel করে।

"আপনার 45-day streak হারাতে চলেছে!" — এই notification টা আসলে আপনাকে কিছু নতুন দিচ্ছে না, বরং আপনার existing achievement হারানোর ভয় তৈরি করছে।`,
    },
    {
      id: "variable-rewards",
      heading: "Variable Rewards",
      content: `Nir Eyal এর Hook Model অনুযায়ী, variable rewards হলো habit formation এর একটা core element।

প্রতিবার আপনি lesson complete করেন, reward টা slightly different হয়। এই unpredictability আপনার dopamine system কে activate রাখে।`,
    },
    {
      id: "social-proof",
      heading: "Social Proof & Competition",
      content: `Leaderboards, friend lists, আর weekly competitions — Duolingo জানে যে social comparison একটা powerful motivator।

Robert Cialdini এর "Influence" বইতে social proof কে persuasion এর ছয়টা key principle এর একটা হিসেবে identify করা হয়েছে।`,
    },
    {
      id: "dark-patterns",
      heading: "Dark Patterns নাকি Good Design?",
      content: `এখানে একটা important ethical question আছে — Duolingo এর techniques কি dark patterns?

আমার মতে, এটা depends on intent এবং outcome এর উপর। Product designers হিসেবে আমাদের responsibility আছে এই line টা carefully navigate করার।`,
    },
    {
      id: "takeaway",
      heading: "Takeaway for Designers",
      content: `Understand your users' intrinsic motivations — external rewards কিছু সময়ের জন্য কাজ করে, কিন্তু long-term retention intrinsic motivation থেকে আসে।

Use loss aversion responsibly — এটা powerful tool, কিন্তু misuse করলে user trust হারাবেন।

Gamification ভালো design এর replacement না — fundamentals strong না হলে কোনো gamification layer কাজ করবে না।`,
    },
  ],
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Extract headings from Sanity Portable Text body for TOC
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

// Extract sections from Sanity Portable Text body
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
      // Content before any heading — create an intro section
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
    // Fall through to default
  }

  return {
    title: SAMPLE_POST.title,
    description: "Blog post",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const sanityPost = await sanityClient.fetch(postBySlugQuery, { slug });

    if (sanityPost) {
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
  } catch {
    // Fall through to sample data
  }

  // Fallback to sample post
  return <BlogPostClient post={SAMPLE_POST} slug={slug} />;
}
