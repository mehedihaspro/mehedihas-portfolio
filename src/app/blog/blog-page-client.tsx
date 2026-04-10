"use client";

import { useState, useMemo } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { LanguageFilter } from "@/components/blog/language-filter";
import { NewsletterSidebar } from "@/components/blog/newsletter-sidebar";
import { Pagination } from "@/components/blog/pagination";
import { Divider } from "@/components/ui/divider";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  hasAudio?: boolean;
  coverColor?: string;
  language?: string;
}

interface BlogPageClientProps {
  posts: Post[];
  categories: string[];
}

const POSTS_PER_PAGE = 5;

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [languageFilter, setLanguageFilter] = useState<"ALL" | "BANGLA" | "ENGLISH">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    if (languageFilter === "ALL") return posts;
    return posts.filter((post) => {
      const lang = post.language?.toUpperCase() || "BANGLA";
      return lang === languageFilter;
    });
  }, [posts, languageFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleLanguageChange = (lang: "ALL" | "BANGLA" | "ENGLISH") => {
    setLanguageFilter(lang);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-20 py-12">
      {/* Header section — rounded container with padding */}
      <section className="rounded-[14px] px-6 py-12 mb-12">
        {/* Breadcrumb */}
        <div className="flex flex-col gap-1 mb-8">
          <p className="text-[16px] font-normal text-text-primary leading-[24px] font-inter">
            <span>Home - </span>
            <span className="text-amber">Blog</span>
          </p>

          {/* Hero title — Amatica SC Bold 128px */}
          <h1 className="font-display font-bold text-[128px] leading-[128px] tracking-[-10.24px] text-[#36322d]">
            Writing &Thinking
          </h1>
        </div>

        {/* Solid divider */}
        <Divider variant="solid" className="mb-8" />

        {/* Language filter + filter icon */}
        <LanguageFilter onSelect={handleLanguageChange} />
      </section>

      {/* Main content area — 80px gap between columns */}
      <section className="flex gap-20 items-start">
        {/* Left column — blog cards */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {paginatedPosts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[16px] text-text-muted font-inter">No articles found.</p>
            </div>
          ) : (
            paginatedPosts.map((post, index) => (
              <div key={post.slug}>
                <BlogCard
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={post.date}
                  readingTime={post.readingTime}
                  hasAudio={post.hasAudio}
                />
                {index < paginatedPosts.length - 1 && (
                  <Divider variant="solid" className="mt-6" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Right column — newsletter sidebar */}
        <aside className="hidden lg:block shrink-0 sticky top-20">
          <NewsletterSidebar />
        </aside>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      )}
    </div>
  );
}
