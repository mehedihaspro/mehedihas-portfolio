"use client";

import { useState } from "react";

interface ShareModalProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: "Twitter",
      color: "#1DA1F2",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Facebook",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      color: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "WhatsApp",
      color: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-cream transition-all"
        aria-label="Share article"
      >
        <ShareIcon />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-12 z-[1000] w-56 rounded-xl bg-bg-card border border-border shadow-modal p-2 animate-in fade-in slide-in-from-top-2">
            <p className="px-3 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Share
            </p>
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: link.color }}
                />
                {link.name}
              </a>
            ))}
            <div className="border-t border-border my-1" />
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
            >
              <CopyIcon />
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8v5a1 1 0 001 1h6a1 1 0 001-1V8" />
      <polyline points="8,2 8,10" />
      <polyline points="5.5,4.5 8,2 10.5,4.5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="4" y="4" width="8" height="8" rx="1.5" />
      <path d="M10 4V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5.5A1.5 1.5 0 003 10h1" />
    </svg>
  );
}
