"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the site footer is near or in the viewport.
 * Used to hide floating UI (audio mini, settings FAB, TOC) so they
 * don't overlap the footer.
 */
export function useFooterVisibility() {
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearFooter(entry.isIntersecting);
      },
      {
        // Trigger 100px before footer comes into view
        rootMargin: "0px 0px 100px 0px",
        threshold: 0,
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return isNearFooter;
}
