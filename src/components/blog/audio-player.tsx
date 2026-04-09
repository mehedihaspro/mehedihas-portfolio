"use client";

import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  title: string;
  duration?: string;
}

export function AudioPlayer({ title, duration = "8:32" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  // Simulated playback for demo — will use real audio URL from Google TTS
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl bg-bg-card border border-border p-4 md:p-5">
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-amber text-white flex items-center justify-center shrink-0 hover:bg-amber-dark transition-colors shadow-accent"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Info + Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <AudioWaveSmall />
              <span className="text-[12px] font-medium text-text-primary truncate">
                Listen to this article
              </span>
            </div>
            <span className="text-[11px] text-text-muted shrink-0 ml-2">
              {duration}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="h-1 rounded-full bg-bg-subtle cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setCurrentTime((x / rect.width) * 100);
            }}
          >
            <div
              className="h-full rounded-full bg-amber transition-[width] duration-100"
              style={{ width: `${currentTime}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l9-5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="2" width="3.5" height="12" rx="1" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
    </svg>
  );
}

function AudioWaveSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-amber">
      <rect x="1" y="5" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.6" />
      <rect x="4" y="3" width="1.5" height="8" rx="0.75" fill="currentColor" opacity="0.8" />
      <rect x="7" y="4" width="1.5" height="6" rx="0.75" fill="currentColor" />
      <rect x="10" y="2" width="1.5" height="10" rx="0.75" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
