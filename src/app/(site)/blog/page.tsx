import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { allPostsQuery, categoriesQuery } from "@/lib/sanity/queries";
import { BlogPageClient } from "./blog-page-client";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on design, creativity, and building products.",
};

export const revalidate = 60;

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
          language?: string;
          publishedAt: string;
          readingTime: string;
          audioUrl: string;
          enableAudio?: boolean;
          coverColor: string;
        }) => ({
          slug: post.slug.current,
          title: post.title,
          excerpt: post.excerpt || "",
          category: post.category,
          date: formatDate(post.publishedAt),
          readingTime: post.readingTime || "5 min read",
          hasAudio: !!post.enableAudio || !!post.audioUrl,
          coverColor: post.coverColor
            ? `bg-[${post.coverColor}]`
            : "bg-bg-subtle",
          language: post.language || "BANGLA",
        })
      );
      categories = (sanityCategories || []).filter(Boolean);
    }
  } catch {
    // Sanity fetch failed
  }

  // Empty state — no hardcoded posts
  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-20 pb-12">
        <PageHeader title="Writing &Thinking" breadcrumbLabel="Blog" />

        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-subtle border border-border flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-text-muted"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2 font-inter">
            No posts yet
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mx-auto font-inter">
            Articles will appear here once published in{" "}
            <Link
              href="/studio"
              className="text-amber hover:text-amber-dark font-medium"
            >
              Sanity Studio
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return <BlogPageClient posts={posts} categories={categories} />;
}
