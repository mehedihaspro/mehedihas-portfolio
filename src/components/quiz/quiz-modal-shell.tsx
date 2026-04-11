"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface QuizModalShellProps {
  isOpen: boolean;
  onDismiss: () => void;
  ariaLabel: string;
  children: ReactNode;
}

/**
 * Shared modal scaffolding for the quiz: backdrop + centered card with a
 * decorative stacked-card hint behind it. NO gradients, NO blur halos —
 * just two flat offset cards behind the active one.
 */
export function QuizModalShell({
  isOpen,
  onDismiss,
  ariaLabel,
  children,
}: QuizModalShellProps) {
  // Track mount so SSR doesn't try to portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // ESC closes
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onDismiss]);

  if (!isOpen || !mounted) return null;

  // Portal to body so the modal lives outside <main>'s stacking context.
  // The site uses `body > * { z-index: 1 }` in globals.css, which traps any
  // fixed-positioned element rendered inside <main>: regardless of internal
  // z-index, it can never beat sibling body children (e.g. <footer> with
  // z-10). Portaling makes the modal a direct body child.
  return createPortal(
    <div
      className="flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      // Inline styles defeat the `body > * { position: relative; z-index: 1 }`
      // rule in globals.css, which has higher specificity than utility classes.
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
      }}
    >
      {/* Backdrop — decorative only. The quiz never dismisses on backdrop
          click; users must use the X button or Esc key. This prevents
          accidental loss of an in-progress quiz. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-none"
      />

      {/* Stacked card hint (decorative, sits behind the active card) */}
      <div
        aria-hidden="true"
        className="relative w-full max-w-[560px] my-auto pointer-events-none"
      >
        <div
          className="absolute inset-0 rounded-[18px] bg-bg-card border border-border opacity-50"
          style={{ transform: "translate(8px, 10px) rotate(1.5deg)" }}
        />
        <div
          className="absolute inset-0 rounded-[18px] bg-bg-card border border-border opacity-75"
          style={{ transform: "translate(4px, 5px) rotate(-1deg)" }}
        />

        {/* Active card */}
        <div className="relative pointer-events-auto rounded-[18px] bg-bg-card border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
