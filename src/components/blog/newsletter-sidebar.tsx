"use client";

import { useState } from "react";
import Image from "next/image";
import { Divider } from "@/components/ui/divider";

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
    <div className="w-[416px] rounded-[18px] border border-border bg-bg p-6 flex flex-col gap-6 items-center">
      <div className="flex flex-col gap-6 items-center justify-center w-full">
        {/* Subscription Form */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col gap-5 items-center w-[295px]">
            {/* Logo */}
            <Image
              src="/logo.svg"
              alt="mehedihas"
              width={59}
              height={48}
              className="h-12 w-auto"
            />

            {/* Title group */}
            <div className="flex flex-col gap-1 items-center text-center w-full text-[#36322d]">
              <h3 className="font-display text-[36px] font-bold leading-[44px] tracking-[-2.88px]">
                A weekly design note
              </h3>
              <p className="font-handwriting text-[14px] font-normal leading-[20px]">
                A research driven article for Designers
              </p>
            </div>
          </div>
        </div>

        {/* Description — Caveat 20px/28px */}
        <p className="font-handwriting text-[20px] font-normal leading-[28px] text-text-primary w-full">
          Idea direction: magazine-style layout, quiet luxury surfaces, sharp typography hierarchy, and enough.
        </p>

        {/* Email form */}
        {status === "success" ? (
          <div className="text-center py-4 w-full">
            <p className="text-[14px] font-medium text-amber font-inter">Thanks for subscribing!</p>
            <p className="text-[12px] text-text-muted mt-1 font-inter">Check your email to confirm.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full rounded-[14px] bg-bg p-0.5 flex flex-col gap-4 items-center justify-center">
            <div className="flex flex-col gap-0.5 items-start w-full">
              {/* Email label with amber bar */}
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-[18px] bg-amber rounded-full" />
                <span className="text-[16px] font-normal text-text-primary leading-[25.88px] font-inter">
                  Email
                </span>
              </div>

              {/* Input with dashed bottom border */}
              <div className="w-full border-b border-dashed border-amber py-4 pr-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@company.com"
                  required
                  className="w-full bg-transparent text-[16px] font-normal text-text-primary placeholder:text-text-muted leading-[24px] focus:outline-none font-inter"
                />
              </div>
            </div>

            {/* Subscribe button — full width, amber, rounded-full, 56px height */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 rounded-full bg-amber text-text-primary text-[16px] font-medium leading-[24px] text-center hover:bg-amber-dark transition-colors disabled:opacity-60 font-inter"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>

      {/* Bottom decorative divider */}
      <Divider variant="decorative" />
    </div>
  );
}
