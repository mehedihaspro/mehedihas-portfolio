"use client";

import { useState, useEffect } from "react";

interface BookmarkButtonProps {
  slug: string;
}

export function BookmarkButton({ slug }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(
      localStorage.getItem("mehedihas-bookmarks") || "[]"
    );
    setSaved(bookmarks.includes(slug));
  }, [slug]);

  const toggle = () => {
    const bookmarks: string[] = JSON.parse(
      localStorage.getItem("mehedihas-bookmarks") || "[]"
    );

    let updated: string[];
    if (bookmarks.includes(slug)) {
      updated = bookmarks.filter((s) => s !== slug);
    } else {
      updated = [...bookmarks, slug];
    }

    localStorage.setItem("mehedihas-bookmarks", JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <button
      onClick={toggle}
      className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
        saved
          ? "bg-highlight-bg border-amber text-amber"
          : "bg-bg-subtle border-border text-text-muted hover:text-text-primary hover:bg-cream"
      }`}
      aria-label={saved ? "Remove bookmark" : "Bookmark article"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path d="M3 2.5h10a.5.5 0 01.5.5v11.5l-5.5-3-5.5 3V3a.5.5 0 01.5-.5z" />
      </svg>
    </button>
  );
}
