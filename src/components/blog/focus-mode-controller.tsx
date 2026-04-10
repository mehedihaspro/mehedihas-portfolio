"use client";

import { useEffect, useRef } from "react";

/**
 * Real reader-app focus mode:
 * When body has `.focus-mode` class, the paragraph closest to the center
 * of the viewport becomes fully opaque while others fade out.
 */
export function FocusModeController() {
  const rafRef = useRef<number>(0);
  const lastActiveRef = useRef<Element | null>(null);

  useEffect(() => {
    const updateFocus = () => {
      if (!document.body.classList.contains("focus-mode")) {
        // Clear any previously active states
        document
          .querySelectorAll("[data-focus-active]")
          .forEach((el) => el.removeAttribute("data-focus-active"));
        lastActiveRef.current = null;
        return;
      }

      const article = document.querySelector("[data-article-body]");
      if (!article) return;

      // Get all focusable text elements (paragraphs, headings, lists, etc.)
      const elements = Array.from(
        article.querySelectorAll("p, h2, h3, h4, ul, ol, blockquote, pre, figure")
      );

      if (elements.length === 0) return;

      const viewportCenter = window.innerHeight / 2;
      let closestEl: Element | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        // Skip elements completely out of view
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

        const elCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestEl = el;
        }
      }

      if (closestEl && closestEl !== lastActiveRef.current) {
        // Remove previous
        if (lastActiveRef.current) {
          lastActiveRef.current.removeAttribute("data-focus-active");
        }
        closestEl.setAttribute("data-focus-active", "true");
        lastActiveRef.current = closestEl;
      }
    };

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateFocus);
    };

    // Observe class changes on body to react to focus mode toggle
    const classObserver = new MutationObserver(() => {
      updateFocus();
    });
    classObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateFocus();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      classObserver.disconnect();
    };
  }, []);

  return null;
}
