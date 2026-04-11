"use client";

import { useState, useMemo } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { LanguageFilter } from "@/components/blog/language-filter";
import { NewsletterSidebar } from "@/components/blog/newsletter-sidebar";
import { Pagination } from "@/components/blog/pagination";
import { Divider } from "@/components/ui/divider";
import { PageHeader } from "@/components/layout/page-header";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  hasAudio?: boolean;
  coverImage?: string;
  coverImageAlt?: string;
  coverColor?: string;
  language?: string;
}

interface BlogPageClientProps {
  posts: Post[];
  categories: string[];
}

const POSTS_PER_PAGE = 5;

export function BlogPageClient({ posts, categories }: BlogPageClientProps) {
  const [languageFilter, setLanguageFilter] = useState<"ALL" | "BANGLA" | "ENGLISH">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const lang = post.language?.toUpperCase() || "BANGLA";
      const matchesLanguage = languageFilter === "ALL" || lang === languageFilter;
      const matchesCategory = !categoryFilter || post.category === categoryFilter;
      return matchesLanguage && matchesCategory;
    });
  }, [posts, languageFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleLanguageChange = (lang: "ALL" | "BANGLA" | "ENGLISH") => {
    setLanguageFilter(lang);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string | null) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-20 pb-12">
      <PageHeader title="Writing &Thinking" breadcrumbLabel="Blog" />

      {/* Filters section — sits tight under the page header, but has
          real breathing room BEFORE the blog list below (per proximity) */}
      <section className="px-4 md:px-6 mb-12 md:mb-16">
        {/* Language + Category filter */}
        <LanguageFilter
          categories={categories}
          onLanguageSelect={handleLanguageChange}
          onCategorySelect={handleCategoryChange}
          postCount={filteredPosts.length}
          activeLanguage={languageFilter}
          activeCategory={categoryFilter}
        />
      </section>

      {/* Main content */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[20px] font-bold text-text-primary font-inter mb-2">
            No articles found
          </p>
          <p className="text-[16px] text-text-muted font-inter mb-4">
            Try changing the language or category filter.
          </p>
          <button
            onClick={() => {
              setLanguageFilter("ALL");
              setCategoryFilter(null);
            }}
            className="text-[14px] text-amber hover:text-amber-dark font-medium font-inter"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <section className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start px-4 md:px-6">
          {/* Left column — blog cards */}
          <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
            {paginatedPosts.map((post, index) => (
              <div key={post.slug}>
                <BlogCard
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={post.date}
                  readingTime={post.readingTime}
                  hasAudio={post.hasAudio}
                  coverImage={post.coverImage}
                  coverImageAlt={post.coverImageAlt}
                />
                {index < paginatedPosts.length - 1 && (
                  <Divider variant="solid" className="mt-6" />
                )}
              </div>
            ))}
          </div>

          {/* Right column — newsletter sidebar (reflows below on <lg) */}
          <aside className="w-full lg:w-auto lg:shrink-0 lg:sticky lg:top-20">
            <NewsletterSidebar />
          </aside>
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="mt-12 px-4 md:px-6">
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
