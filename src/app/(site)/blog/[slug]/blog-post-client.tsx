"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Headphones } from "lucide-react";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AudioPlayer } from "@/components/blog/audio-player";
import { ShareDropdown } from "@/components/blog/share-dropdown";
import { ReadingSettings } from "@/components/blog/reading-settings";
import { ReferencesSection } from "@/components/blog/references-section";
import { FactCheckSection } from "@/components/blog/fact-check-section";
import { RelatedContent } from "@/components/blog/related-content";
import { Toast } from "@/components/blog/toast";
import { SelectionPopover } from "@/components/blog/selection-popover";
import { PortableTextRenderer } from "@/components/blog/portable-text-renderer";
import { FocusModeController } from "@/components/blog/focus-mode-controller";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Reference {
  title: string;
  author?: string;
  url?: string;
  publication?: string;
  year?: string;
}

interface FactCheck {
  claim: string;
  status: "verified" | "partial" | "context" | "disputed";
  source?: string;
  note?: string;
}

interface RelatedPost {
  slug: { current: string } | string;
  title: string;
  excerpt?: string;
  category?: string;
  readingTime?: string;
  publishedAt?: string;
  coverColor?: string;
  audioUrl?: string;
  enableAudio?: boolean;
}

interface Post {
  title: string;
  summary?: string;
  category: string;
  date: string;
  readingTime: string;
  author: string;
  hasAudio: boolean;
  audioDuration?: string;
  language?: string;
  tocItems: TocItem[];
  body: unknown[];
  plainText: string;
  references?: Reference[];
  factChecks?: FactCheck[];
  relatedPosts?: RelatedPost[];
}

interface BlogPostClientProps {
  post: Post;
  slug: string;
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: "",
    show: false,
  });
  const [audioOpen, setAudioOpen] = useState(false);

  const showToast = (message: string) => {
    setToast({ message, show: true });
  };

  const hideToast = () => setToast({ message: "", show: false });

  const currentUrl = useMemo(() => {
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    } catch {
      showToast("Failed to copy");
    }
  };

  const handleHighlight = (text: string) => {
    const highlights = JSON.parse(
      localStorage.getItem("mehedihas-highlights") || "[]"
    );
    highlights.push({
      text,
      url: currentUrl,
      timestamp: Date.now(),
    });
    localStorage.setItem("mehedihas-highlights", JSON.stringify(highlights));
    showToast("Highlighted");
  };

  const handleShareSelection = async (text: string) => {
    try {
      await navigator.clipboard.writeText(`"${text}"\n\n${currentUrl}`);
      showToast("Quote copied to clipboard");
    } catch {
      showToast("Failed to copy");
    }
  };

  return (
    <>
      <ReadingProgress />
      <FocusModeController />

      <div className="mx-auto max-w-[820px] px-6 pt-24 pb-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-[12px] text-text-muted font-inter">
          <Link
            href="/blog"
            className="hover:text-text-primary transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-amber">{post.category}</span>
        </nav>

        {/* Category chip */}
        <div className="flex items-center gap-2 mb-7">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-subtle border border-border text-[13px] font-semibold uppercase tracking-[0.3px] text-text-secondary font-inter">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[clamp(32px,5.5vw,50px)] font-bold text-text-primary leading-[1.25] tracking-[-0.5px] mb-6 font-inter">
          {post.title}
        </h1>

        {/* Summary with amber left bar */}
        {post.summary && (
          <p className="text-[19px] leading-[1.8] text-text-secondary border-l-[3px] border-amber pl-5 max-w-[680px] mb-8 font-inter">
            {post.summary}
          </p>
        )}

        {/* Meta bar */}
        <div className="flex items-center justify-between gap-4 pb-8 mb-8 border-b border-border flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-bg-subtle border border-border" />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-text-primary font-inter">
                {post.author}
              </span>
              <div className="flex items-center gap-2 text-[13px] text-text-muted font-inter">
                <span>{post.date}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-text-muted" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {post.hasAudio && (
              <button
                onClick={() => setAudioOpen(!audioOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all font-inter ${
                  audioOpen
                    ? "border-amber bg-highlight-bg text-amber"
                    : "border-border text-text-secondary hover:border-amber hover:text-amber"
                }`}
                aria-label="Toggle audio player"
              >
                <Headphones size={14} />
                Listen
              </button>
            )}
            <ShareDropdown
              title={post.title}
              url={currentUrl}
              onToast={showToast}
            />
          </div>
        </div>

        {/* Audio player (expandable, becomes sticky on scroll) */}
        {audioOpen && post.hasAudio && (
          <div className="mb-8 animate-in slide-in-from-top-2 fade-in duration-300">
            <AudioPlayer
              title={post.title}
              articleText={post.plainText}
              language={post.language}
              onClose={() => setAudioOpen(false)}
            />
          </div>
        )}

        {/* Article body */}
        <article>
          <div
            data-article-body
            className="max-w-[680px] mx-auto text-[18px] leading-[1.95] text-text-primary"
          >
            <PortableTextRenderer value={post.body} />
          </div>

          {/* References */}
          {post.references && post.references.length > 0 && (
            <ReferencesSection references={post.references} />
          )}

          {/* Fact Check Report */}
          {post.factChecks && post.factChecks.length > 0 && (
            <FactCheckSection factChecks={post.factChecks} />
          )}
        </article>

        {/* Related content — using BlogCard */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <RelatedContent posts={post.relatedPosts} />
        )}

        {/* Back to blog */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-amber transition-colors font-inter"
          >
            <ArrowLeft size={16} />
            Back to all articles
          </Link>
        </div>
      </div>

      {/* Table of Contents (floating) */}
      {post.tocItems && post.tocItems.length > 0 && (
        <TableOfContents items={post.tocItems} />
      )}

      {/* Reading settings FAB */}
      <ReadingSettings />

      {/* Selection popover */}
      <SelectionPopover
        containerSelector="[data-article-body]"
        onCopy={handleCopy}
        onHighlight={handleHighlight}
        onShare={handleShareSelection}
      />

      {/* Toast */}
      <Toast message={toast.message} show={toast.show} onHide={hideToast} />
    </>
  );
}
