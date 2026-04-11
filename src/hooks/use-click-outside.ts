"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `handler` when a click or touch occurs outside of `ref`.
 * Pass an array of refs to allow multiple containers (e.g. trigger + popover).
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | Array<RefObject<T | null>>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const refs = Array.isArray(ref) ? ref : [ref];

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      // If the click is inside any of the refs, ignore
      for (const r of refs) {
        if (r.current && r.current.contains(target)) return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener, { passive: true });

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
