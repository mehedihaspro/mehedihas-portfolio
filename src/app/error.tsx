"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console; in prod you could wire this to an error tracking service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold text-amber uppercase tracking-[0.14em] mb-3">
          Something broke
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
          An unexpected error occurred.
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          Try reloading the page. If the problem persists, head back home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="h-10 px-5 inline-flex items-center justify-center rounded-xl bg-text-primary text-bg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="h-10 px-5 inline-flex items-center justify-center rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-bg-subtle hover:text-text-primary transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
