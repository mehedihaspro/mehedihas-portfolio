"use client";

import { useEffect, useState } from "react";
import { Highlighter, Copy, Share2 } from "lucide-react";

interface SelectionPopoverProps {
  onCopy: (text: string) => void;
  onHighlight: (text: string) => void;
  onShare: (text: string) => void;
  containerSelector: string;
}

export function SelectionPopover({
  onCopy,
  onHighlight,
  onShare,
  containerSelector,
}: SelectionPopoverProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setPosition(null);
        return;
      }

      const text = selection.toString().trim();
      if (!text || text.length < 2) {
        setPosition(null);
        return;
      }

      // Verify selection is within the content container
      const container = document.querySelector(containerSelector);
      if (!container) {
        setPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) {
        setPosition(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 12,
      });
      setSelectedText(text);
    };

    const handleMouseUp = () => {
      setTimeout(handleSelection, 10);
    };

    const handleScroll = () => {
      setPosition(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [containerSelector]);

  if (!position) return null;

  return (
    <div
      className="fixed z-[1002] flex items-center gap-0.5 p-1 rounded-[10px] bg-[#2D2D2D] shadow-[0_8px_24px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <button
        onClick={() => {
          onHighlight(selectedText);
          setPosition(null);
        }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-[7px] text-[12px] font-medium text-white hover:bg-white/10 transition-colors font-inter"
      >
        <Highlighter size={13} />
        Highlight
      </button>
      <div className="w-px h-4 bg-white/20" />
      <button
        onClick={() => {
          onCopy(selectedText);
          setPosition(null);
          window.getSelection()?.removeAllRanges();
        }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-[7px] text-[12px] font-medium text-white hover:bg-white/10 transition-colors font-inter"
      >
        <Copy size={13} />
        Copy
      </button>
      <div className="w-px h-4 bg-white/20" />
      <button
        onClick={() => {
          onShare(selectedText);
          setPosition(null);
        }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-[7px] text-[12px] font-medium text-white hover:bg-white/10 transition-colors font-inter"
      >
        <Share2 size={13} />
        Share
      </button>
      {/* Arrow pointing down */}
      <div
        className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#2D2D2D] rotate-45"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </div>
  );
}
