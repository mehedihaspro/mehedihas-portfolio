"use client";

import { useState } from "react";

export function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Will connect to Kit API later
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="rounded-2xl bg-bg-card border border-border p-6 md:p-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-highlight-bg flex items-center justify-center shrink-0">
          <MailIcon />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            Subscribe to the newsletter
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Design insights, thoughts, and updates delivered to your inbox.
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-highlight-bg">
          <CheckIcon />
          <span className="text-sm font-medium text-amber-dark">
            Thanks! Check your email to confirm.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 h-10 px-4 rounded-xl bg-bg-subtle border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-highlight-bg transition-all duration-200"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="h-10 px-5 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber-dark transition-colors duration-200 disabled:opacity-60 shrink-0"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber">
      <rect x="2" y="4" width="14" height="10" rx="2" />
      <path d="M2 6l7 4 7-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-dark">
      <path d="M4 8l3 3 5-6" />
    </svg>
  );
}
