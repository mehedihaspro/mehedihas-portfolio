"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Share2, Volume2, Loader2 } from "lucide-react";

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
          voice: "female",
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
      className="fixed z-[1002] animate-in fade-in zoom-in-95 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div
        className="flex items-stretch bg-[#1a1a1a] rounded-[14px] overflow-hidden border border-white/10"
        style={{
          boxShadow: "0 16px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {/* Pronounce */}
        <button
          onClick={handlePronounce}
          disabled={isPronouncing}
          className="group flex flex-col items-center gap-1 px-5 py-3 text-white hover:bg-white/10 active:bg-white/15 transition-colors font-inter disabled:opacity-60"
        >
          <div className="w-7 h-7 rounded-full bg-amber/20 flex items-center justify-center text-amber group-hover:bg-amber/30 transition-colors">
            {isPronouncing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Volume2 size={15} />
            )}
          </div>
          <span className="text-[11px] font-medium tracking-tight">
            Pronounce
          </span>
        </button>

        <div className="w-px bg-white/10" />

        {/* Copy */}
        <button
          onClick={() => {
            onCopy(selectedText);
            setPosition(null);
            window.getSelection()?.removeAllRanges();
          }}
          className="group flex flex-col items-center gap-1 px-5 py-3 text-white hover:bg-white/10 active:bg-white/15 transition-colors font-inter"
        >
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/90 group-hover:bg-white/20 transition-colors">
            <Copy size={14} />
          </div>
          <span className="text-[11px] font-medium tracking-tight">Copy</span>
        </button>

        <div className="w-px bg-white/10" />

        {/* Share */}
        <button
          onClick={() => {
            onShare(selectedText);
            setPosition(null);
          }}
          className="group flex flex-col items-center gap-1 px-5 py-3 text-white hover:bg-white/10 active:bg-white/15 transition-colors font-inter"
        >
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/90 group-hover:bg-white/20 transition-colors">
            <Share2 size={14} />
          </div>
          <span className="text-[11px] font-medium tracking-tight">Share</span>
        </button>
      </div>

      {/* Arrow pointing down */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-3 h-3 bg-[#1a1a1a] rotate-45 border-r border-b border-white/10"
      />
    </div>
  );
}
