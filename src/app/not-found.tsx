import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold text-amber uppercase tracking-[0.14em] mb-3">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
          This page wandered off.
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          The link might be broken, or the page may have moved. Let&apos;s get
          you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="h-10 px-5 inline-flex items-center justify-center rounded-xl bg-text-primary text-bg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Back home
          </Link>
          <Link
            href="/blog"
            className="h-10 px-5 inline-flex items-center justify-center rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-bg-subtle hover:text-text-primary transition-colors"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
