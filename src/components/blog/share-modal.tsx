"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, Link2, Mail } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  selectedText?: string;
  onToast?: (msg: string) => void;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  selectedText,
  onToast,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = selectedText ? `"${selectedText}" — ${title}` : title;

  const shareOptions = [
    {
      name: "Twitter",
      color: "#1DA1F2",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      color: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      color: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      name: "Email",
      color: "#6B5D4F",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
      icon: <Mail size={16} />,
    },
    {
      name: "Copy Link",
      color: "#E8A832",
      icon: <Link2 size={16} />,
      action: async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          onToast?.("Link copied to clipboard");
          setTimeout(() => setCopied(false), 2000);
        } catch {
          onToast?.("Failed to copy link");
        }
      },
    },
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-[420px] rounded-[18px] bg-bg-card border border-border p-8 animate-in fade-in zoom-in-95 duration-200"
          style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[18px] font-bold text-text-primary font-inter">
              Share this article
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-[12px] text-text-muted mb-6 font-inter">
            {selectedText ? "Share the selected text" : title}
          </p>

          {/* Share options grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {shareOptions.slice(0, 6).map((option) => {
              if (option.action) {
                return (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="flex flex-col items-center gap-1.5 py-3.5 px-1 rounded-[12px] border border-border bg-bg hover:border-amber hover:-translate-y-0.5 transition-all"
                  >
                    <div
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white"
                      style={{ backgroundColor: option.color }}
                    >
                      {copied ? <Check size={16} /> : option.icon}
                    </div>
                    <span className="text-[10px] font-medium text-text-muted font-inter">
                      {copied ? "Copied!" : option.name}
                    </span>
                  </button>
                );
              }
              return (
                <a
                  key={option.name}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onClose()}
                  className="flex flex-col items-center gap-1.5 py-3.5 px-1 rounded-[12px] border border-border bg-bg hover:border-amber hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white"
                    style={{ backgroundColor: option.color }}
                  >
                    {option.icon}
                  </div>
                  <span className="text-[10px] font-medium text-text-muted font-inter">
                    {option.name}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Link box */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] bg-bg-subtle border border-border">
              <Link2 size={12} className="text-text-muted shrink-0" />
              <span className="text-[12px] text-text-secondary truncate font-inter">
                {url}
              </span>
            </div>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                  onToast?.("Link copied");
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  onToast?.("Failed to copy");
                }
              }}
              className="px-4 py-2.5 rounded-[10px] bg-amber hover:bg-amber-dark text-white text-[12px] font-semibold transition-colors font-inter flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check size={13} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
