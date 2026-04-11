"use client";

import { useState } from "react";
import Image from "next/image";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";

export function NewsletterSidebar() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Failed to subscribe. Please try again.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full lg:w-[416px] rounded-[18px] border border-border bg-bg p-6 flex flex-col gap-6 items-center">
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
            <div className="flex flex-col gap-1 items-center text-center w-full text-ink-display">
              <h3 className="font-display text-[36px] font-bold leading-[44px] tracking-[-2.88px]">
                A weekly design note
              </h3>
              <p className="font-handwriting text-[18px] font-normal leading-[24px]">
                A research driven article for Designers
              </p>
            </div>
          </div>
        </div>

        {/* Email form */}
        {status === "success" ? (
          <div className="text-center py-6 w-full" role="status" aria-live="polite">
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
              <div className="flex items-center">
                {/* Animated amber bar — grows in width so label slides right */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isFocused ? "w-[10px]" : "w-0"
                  }`}
                >
                  <div className="w-0.5 h-[18px] bg-amber rounded-full" />
                </div>
                <span className="text-[16px] font-normal text-text-primary leading-[25.88px] font-inter">
                  Email
                </span>
              </div>

              {/* Input with animated dashed bottom border */}
              <div className="w-full relative">
                <input
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
                  className="w-full bg-transparent text-[16px] font-normal text-text-primary placeholder:text-text-muted leading-[24px] focus:outline-none focus:ring-0 focus:border-0 font-inter py-4 pr-3 border-0 shadow-none appearance-none"
                  style={{ boxShadow: "none", outline: "none" }}
                />

                {/* Bottom border — default color, dashed */}
                <div className="absolute bottom-0 left-0 right-0 h-0 border-b border-dashed border-border" />

                {/* Animated amber overlay — grows left to right on focus */}
                <div
                  className={`absolute bottom-0 left-0 h-0 border-b border-dashed border-amber transition-all duration-500 ease-out ${
                    isFocused ? "w-full" : "w-0"
                  }`}
                />
              </div>

              {/* Error message */}
              {status === "error" && errorMsg && (
                <p className="text-[12px] text-error font-inter mt-1.5 font-medium" role="alert">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Subscribe button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={status === "loading"}
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>

      {/* Reassurance line — from Figma */}
      {status !== "success" && (
        <p className="text-[12px] font-normal text-text-secondary leading-[20px] text-center w-full font-inter">
          Free forever. Unsubscribe anytime. No spam.
        </p>
      )}

      <Divider variant="decorative" />
    </div>
  );
}
