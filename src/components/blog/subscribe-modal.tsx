"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { NewsletterSidebar } from "./newsletter-sidebar";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // Portal to body — see comment in QuizModalShell for why
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 1100 }}
      />

      {/* Modal */}
      <div
        className="flex items-center justify-center p-4 md:p-6 pointer-events-none overflow-y-auto"
        style={{ position: "fixed", inset: 0, zIndex: 1101 }}
      >
        <div className="pointer-events-auto relative animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-bg-card hover:bg-bg-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close"
            style={{
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
            }}
          >
            <X size={15} />
          </button>

          {/* Newsletter sidebar reused as modal content */}
          <div className="w-full md:w-[416px]">
            <NewsletterSidebar />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
