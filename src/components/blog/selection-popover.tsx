"use client";

import { useEffect, useRef, useState } from "react";

interface SelectionPopoverProps {
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
  onToast?: (msg: string) => void;
  containerSelector: string;
}

// Detect if text contains Bangla characters (Unicode range)
function detectLanguage(text: string): "BANGLA" | "ENGLISH" {
  return /[\u0980-\u09FF]/.test(text) ? "BANGLA" : "ENGLISH";
}

export function SelectionPopover({
  onCopy,
  onShare,
  onToast,
  containerSelector,
}: SelectionPopoverProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedText, setSelectedText] = useState("");
  const [isPronouncing, setIsPronouncing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        y: rect.top - 14,
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

  const handlePronounce = async () => {
    if (isPronouncing || !selectedText) return;

    if (selectedText.length > 200) {
      onToast?.("Select a shorter phrase to pronounce");
      return;
    }

    setIsPronouncing(true);
    try {
      const language = detectLanguage(selectedText);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        onToast?.(data.error || "Failed to pronounce");
        setIsPronouncing(false);
        return;
      }

      const byteCharacters = atob(data.audioContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsPronouncing(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsPronouncing(false);
        onToast?.("Couldn't play audio");
      };
      await audio.play();
    } catch {
      setIsPronouncing(false);
      onToast?.("Pronunciation failed");
    }
  };

  if (!position) return null;

  return (
    <div
      className="fixed z-[1002] animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
      }}
      role="toolbar"
      aria-label="Text actions"
    >
      {/* Theme-aware pill using design tokens. In light themes this is a
          dark pill with light text; in dark themes it flips automatically. */}
      <div className="flex items-stretch bg-text-primary text-bg rounded-full overflow-hidden">
        <button
          type="button"
          onClick={handlePronounce}
          disabled={isPronouncing}
          aria-busy={isPronouncing || undefined}
          className="px-4 h-10 text-[13px] font-semibold font-inter hover:opacity-80 transition-opacity disabled:opacity-60 disabled:cursor-wait"
        >
          {isPronouncing ? "Pronouncing…" : "Pronounce"}
        </button>

        <span className="w-px bg-bg/20" aria-hidden="true" />

        <button
          type="button"
          onClick={() => {
            onCopy(selectedText);
            setPosition(null);
            window.getSelection()?.removeAllRanges();
          }}
          className="px-4 h-10 text-[13px] font-semibold font-inter hover:opacity-80 transition-opacity"
        >
          Copy
        </button>

        <span className="w-px bg-bg/20" aria-hidden="true" />

        <button
          type="button"
          onClick={() => {
            onShare(selectedText);
            setPosition(null);
          }}
          className="px-4 h-10 text-[13px] font-semibold font-inter hover:opacity-80 transition-opacity"
        >
          Share
        </button>
      </div>

      {/* Arrow pointing down to the selection */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-[4px] w-2 h-2 bg-text-primary rotate-45"
        aria-hidden="true"
      />
    </div>
  );
}
