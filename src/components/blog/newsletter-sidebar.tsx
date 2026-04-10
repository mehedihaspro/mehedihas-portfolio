"use client";

import { useState } from "react";
import Image from "next/image";

export function NewsletterSidebar() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="rounded-2xl bg-bg-card border border-border p-6 sticky top-20">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/logo.svg"
          alt="mehedihas"
          width={59}
          height={48}
          className="h-10 w-auto"
        />
      </div>

      {/* Title */}
      <h3 className="text-center text-[20px] font-bold text-text-primary tracking-tight uppercase mb-1">
        A weekly design note
      </h3>
      <p className="text-center text-[12px] text-text-muted mb-5">
        A research driven article for Designers
      </p>

      {/* Divider */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <div className="h-px flex-1 bg-border" />
        <span className="text-text-muted text-[10px]">✦</span>
        <span className="text-text-muted text-[10px]">✦</span>
        <span className="text-text-muted text-[10px]">✦</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Description */}
      <p className="text-center text-[14px] text-text-secondary italic leading-relaxed mb-6">
        Idea direction: magazine-style layout, quiet luxury surfaces, sharp typography hierarchy, and enough.
      </p>

      {status === "success" ? (
        <div className="text-center py-4">
          <p className="text-sm font-medium text-amber">Thanks for subscribing!</p>
          <p className="text-[12px] text-text-muted mt-1">Check your email to confirm.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Email label */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-0.5 h-3 bg-amber rounded-full" />
            <label className="text-[13px] font-medium text-text-primary">
              Email
            </label>
          </div>

          {/* Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@company.com"
            required
            className="w-full h-10 px-0 border-0 border-b border-dashed border-text-muted bg-transparent text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber transition-colors mb-5"
          />

          {/* Subscribe button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full h-11 rounded-full bg-amber text-white text-[14px] font-semibold hover:bg-amber-dark transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {/* Bottom divider */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <span className="text-text-muted text-[10px]">✦</span>
        <span className="text-text-muted text-[10px]">✦</span>
        <span className="text-text-muted text-[10px]">✦</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
