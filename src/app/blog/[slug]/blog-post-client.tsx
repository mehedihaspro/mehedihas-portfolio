"use client";

import Link from "next/link";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AudioPlayer } from "@/components/blog/audio-player";
import { ShareButton } from "@/components/blog/share-modal";
import { ReadingSettings } from "@/components/blog/reading-settings";
import { BookmarkButton } from "@/components/blog/bookmark-button";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Section {
  id: string;
  heading: string;
  content: string;
}

interface Post {
  title: string;
  category: string;
  date: string;
  readingTime: string;
  author: string;
  hasAudio: boolean;
  audioDuration: string;
  coverColor: string;
  tocItems: TocItem[];
  sections: Section[];
}

interface BlogPostClientProps {
  post: Post;
  slug: string;
}

export function BlogPostClient({ post, slug }: BlogPostClientProps) {
  return (
    <>
      <ReadingProgress />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[12px] text-text-muted">
          <Link
            href="/blog"
            className="hover:text-text-primary transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-amber">{post.category}</span>
        </nav>

        {/* Article Header */}
        <header className="max-w-[820px] mb-10">
          <span className="inline-block text-[11px] font-semibold text-amber uppercase tracking-[0.14em] mb-3">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-[42px] font-bold text-text-primary leading-[1.15] tracking-tight mb-5">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-[13px] text-text-muted">
            <span className="font-medium text-text-secondary">
              {post.author}
            </span>
            <span>&middot;</span>
            <span>{post.date}</span>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        {/* Cover Image */}
        <div
          className={`w-full max-w-[820px] aspect-[2.2/1] rounded-2xl ${post.coverColor} mb-10`}
        />

        {/* Toolbar: Actions */}
        <div className="max-w-[820px] flex items-center justify-between mb-8 pb-6 border-b border-border">
          {/* Audio Player */}
          {post.hasAudio && (
            <div className="flex-1 max-w-md">
              <AudioPlayer
                title={post.title}
                duration={post.audioDuration}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <ReadingSettings />
            <BookmarkButton slug={slug} />
            <ShareButton
              title={post.title}
              url={typeof window !== "undefined" ? window.location.href : ""}
            />
          </div>
        </div>

        {/* Content Area: TOC sidebar + Article */}
        <div className="flex gap-12 max-w-[1100px]">
          {/* Main Article */}
          <article className="flex-1 max-w-[680px]">
            <div
              data-article-body
              className="text-[18px] leading-[1.8] text-text-primary"
            >
              {post.sections.map((section) => (
                <section key={section.id} className="mb-10">
                  <h2
                    id={section.id}
                    className="text-[27px] font-bold text-text-primary leading-tight mb-4 scroll-mt-20"
                  >
                    {section.heading}
                  </h2>
                  {section.content.split("\n\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className="mb-4 text-text-secondary leading-[inherit]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bg-subtle border border-border" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {post.author}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      Product Designer & Author
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookmarkButton slug={slug} />
                  <ShareButton
                    title={post.title}
                    url={
                      typeof window !== "undefined"
                        ? window.location.href
                        : ""
                    }
                  />
                </div>
              </div>
            </footer>
          </article>

          {/* Sidebar: Table of Contents */}
          <aside className="hidden lg:block w-56 shrink-0">
            <TableOfContents items={post.tocItems} />
          </aside>
        </div>

        {/* Back to Blog */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-amber transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="8" x2="4" y2="8" />
              <polyline points="7,4 3.5,8 7,12" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </div>
    </>
  );
}
