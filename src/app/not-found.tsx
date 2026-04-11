import Link from "next/link";
import type { Metadata } from "next";
import { buttonClasses } from "@/components/ui/button";

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
          <Link href="/" className={buttonClasses({ variant: "primary", size: "md" })}>
            Back home
          </Link>
          <Link href="/blog" className={buttonClasses({ variant: "secondary", size: "md" })}>
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
