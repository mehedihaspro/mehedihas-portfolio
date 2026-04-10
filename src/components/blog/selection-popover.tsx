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

  const handlePronounce = async () => {
    if (isPronouncing || !selectedText) return;

    // Google TTS has a max ~5000 char limit but for pronunciation we want short
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

      // Convert base64 to blob and play
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
      className="fixed z-[1002] flex items-center gap-0.5 p-1 rounded-[10px] bg-[#2D2D2D] shadow-[0_8px_24px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <button
        onClick={handlePronounce}
        disabled={isPronouncing}
        className="flex items-center gap-1.5 px-3 py-2 rounded-[7px] text-[12px] font-medium text-white hover:bg-white/10 transition-colors font-inter disabled:opacity-60"
      >
        {isPronouncing ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Volume2 size={13} />
        )}
        Pronounce
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
