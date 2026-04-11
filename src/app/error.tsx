"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/button";

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
          <Button variant="primary" size="md" onClick={reset}>
            Try again
          </Button>
          <Link href="/" className={buttonClasses({ variant: "secondary", size: "md" })}>
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
