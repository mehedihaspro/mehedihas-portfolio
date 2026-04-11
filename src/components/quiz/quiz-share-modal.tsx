"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Check, Copy } from "lucide-react";
import { QuizModalShell } from "./quiz-modal-shell";
import { Button } from "@/components/ui/button";

interface QuizShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  total: number;
  articleTitle: string;
  articleUrl: string;
}

export function QuizShareModal({
  isOpen,
  onClose,
  score,
  total,
  articleTitle,
  articleUrl,
}: QuizShareModalProps) {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const shareUrlParams = new URLSearchParams({
    score: String(score),
    total: String(total),
    ...(name ? { name } : {}),
  });
  const shareUrl = `${articleUrl}?${shareUrlParams.toString()}`;

  const shareText = name
    ? `${name} scored ${score}/${total} on "${articleTitle}" quiz by @mehedihas`
    : `I scored ${score}/${total} on "${articleTitle}" quiz by @mehedihas`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Single-color icon set, monochrome — no brand color tiles
  const socialLinks = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      ),
    },
  ];

  return (
    <QuizModalShell isOpen onDismiss={onClose} ariaLabel="Share your score">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="text-[12px] font-mono uppercase tracking-[0.12em] text-text-muted">
          Share your score
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      <div className="p-6">
        {/* Score preview card — flat, no gradients */}
        <div className="rounded-[14px] border border-border bg-bg p-6 mb-5">
          {/* Logo + label */}
          <div className="flex items-center justify-between mb-5">
            <Image
              src="/logo.svg"
              alt="mehedihas"
              width={36}
              height={30}
              className="h-7 w-auto"
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-text-muted">
              Quiz score
            </span>
          </div>

          {/* Score */}
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-[56px] font-bold leading-none text-text-primary tracking-[-0.03em] font-inter tabular-nums">
              {score}
            </span>
            <span className="text-[24px] font-bold text-text-muted font-inter tabular-nums">
              /{total}
            </span>
            <span className="ml-auto text-[13px] font-bold text-amber font-inter tabular-nums">
              {percent}%
            </span>
          </div>

          {name && (
            <p className="text-[12px] text-text-secondary font-inter mb-1">
              <span className="font-bold text-text-primary">{name}</span> aced it
            </p>
          )}

          <p className="text-[12px] text-text-muted font-inter leading-snug line-clamp-2">
            {articleTitle}
          </p>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted">
              mehedihas.pro
            </span>
            <span className="text-[10px] text-text-muted font-inter italic">
              Take the quiz
            </span>
          </div>
        </div>

        {/* Name input */}
        <div className="mb-5">
          <label
            htmlFor="quiz-share-name"
            className="block text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted mb-2"
          >
            Your name (optional)
          </label>
          <input
            id="quiz-share-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder="Add your name to personalize"
            className="w-full h-11 px-4 rounded-full bg-bg border border-border text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber transition-colors font-inter"
          />
        </div>

        {/* Social row — monochrome, single accent */}
        <div className="flex items-center gap-2 mb-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-full border border-border bg-bg-card flex items-center justify-center text-text-secondary hover:text-amber hover:border-amber hover:bg-highlight-bg transition-colors"
              aria-label={`Share on ${link.name}`}
              title={`Share on ${link.name}`}
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Copy link */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={copyLink}
          leadingIcon={
            copied ? (
              <Check size={14} strokeWidth={3} />
            ) : (
              <Copy size={14} />
            )
          }
        >
          {copied ? "Link copied" : "Copy share link"}
        </Button>
      </div>
    </QuizModalShell>
  );
}
