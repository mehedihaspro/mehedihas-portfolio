"use client";

import { useState, useMemo } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { CategoryFilter } from "@/components/blog/category-filter";
import { SearchBar } from "@/components/blog/search-bar";
import { NewsletterInline } from "@/components/blog/newsletter-inline";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  hasAudio?: boolean;
  coverColor?: string;
}

interface BlogPageClientProps {
  posts: Post[];
  categories: string[];
}

export function BlogPageClient({ posts, categories }: BlogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        !selectedCategory || post.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20">
      {/* Header */}
      <section className="pt-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="text-[11px] font-semibold text-amber uppercase tracking-[0.14em] mb-3">
              Blog
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-[1.1] tracking-tight">
              Writing &<br />
              <span className="text-text-secondary">Thinking</span>
            </h1>
          </div>
          <div className="w-full md:w-72">
            <SearchBar onSearch={setSearchQuery} placeholder="Search articles..." />
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter categories={categories} onSelect={setSelectedCategory} />
      </section>

      {/* Post Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[12px] text-text-muted">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
          {selectedCategory && (
            <span>
              {" "}
              in <span className="text-amber font-medium">{selectedCategory}</span>
            </span>
          )}
        </p>
        {(selectedCategory || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery("");
            }}
            className="text-[12px] text-amber hover:text-amber-dark font-medium transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-text-muted">No articles found.</p>
          <p className="text-sm text-text-muted mt-2">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-8">
              <BlogCard {...featuredPost} featured />
            </section>
          )}

          {/* Post Grid — Bento-style mixed sizes */}
          {remainingPosts.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {remainingPosts.map((post, index) => (
                <div
                  key={post.slug}
                  className={
                    index === 0 ? "md:col-span-2 lg:col-span-1" : ""
                  }
                >
                  <BlogCard {...post} />
                </div>
              ))}
            </section>
          )}

          {/* Newsletter CTA (inline) */}
          <section className="my-12">
            <NewsletterInline />
          </section>
        </>
      )}
    </div>
  );
}
