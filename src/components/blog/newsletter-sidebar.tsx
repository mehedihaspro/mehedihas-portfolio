"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Divider } from "@/components/ui/divider";

export function NewsletterSidebar() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setErrorMsg("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    // Will connect to Kit API
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="w-[416px] rounded-[18px] border border-border bg-bg p-6 flex flex-col gap-6 items-center">
      <div className="flex flex-col gap-6 items-center justify-center w-full">
        {/* Subscription Form */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col gap-5 items-center w-[295px]">
            <Image
              src="/logo.svg"
              alt="mehedihas"
              width={59}
              height={48}
              className="h-12 w-auto"
            />
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

        {/* Description */}
        <p className="font-handwriting text-[20px] font-normal leading-[28px] text-text-primary w-full">
          Idea direction: magazine-style layout, quiet luxury surfaces, sharp typography hierarchy, and enough.
        </p>

        {/* Email form */}
        {status === "success" ? (
          <div className="text-center py-6 w-full">
            <div className="w-12 h-12 rounded-full bg-highlight-bg flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-amber">
                <path d="M4 10l4 4 8-9" />
              </svg>
            </div>
            <p className="text-[16px] font-medium text-text-primary font-inter mb-1">
              You&apos;re in!
            </p>
            <p className="text-[13px] text-text-muted font-inter">
              Check your email to confirm subscription.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="w-full rounded-[14px] bg-bg p-0.5 flex flex-col gap-4 items-center justify-center">
            <div className="flex flex-col gap-0.5 items-start w-full">
              {/* Email label with animated amber bar */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-0.5 rounded-full bg-amber transition-all duration-300 ease-out ${
                    isFocused ? "h-[18px] opacity-100" : "h-0 opacity-0"
                  }`}
                />
                <span className="text-[16px] font-normal text-text-primary leading-[25.88px] font-inter">
                  Email
                </span>
              </div>

              {/* Input with animated dashed bottom border */}
              <div className="w-full relative">
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMsg("");
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="example@company.com"
                  className="w-full bg-transparent text-[16px] font-normal text-text-primary placeholder:text-text-muted leading-[24px] focus:outline-none font-inter py-4 pr-3 border-0"
                />

                {/* Bottom border — default color, dashed */}
                <div className="absolute bottom-0 left-0 right-0 h-px border-b border-dashed border-border" />

                {/* Animated amber overlay — grows left to right on focus */}
                <div
                  className={`absolute bottom-0 left-0 h-px border-b border-dashed border-amber transition-all duration-500 ease-out ${
                    isFocused ? "w-full" : "w-0"
                  }`}
                />
              </div>

              {/* Error message */}
              {status === "error" && errorMsg && (
                <p className="text-[12px] text-[#c0392b] font-inter mt-1.5 font-medium">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Subscribe button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 rounded-full bg-amber text-text-primary text-[16px] font-medium leading-[24px] text-center hover:bg-amber-dark transition-colors disabled:opacity-70 font-inter relative overflow-hidden"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-text-primary/30 border-t-text-primary rounded-full animate-spin" />
                  Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        )}
      </div>

      <Divider variant="decorative" />
    </div>
  );
}
