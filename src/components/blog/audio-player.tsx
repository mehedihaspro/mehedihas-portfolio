"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, AudioLines } from "lucide-react";

interface AudioPlayerProps {
  title: string;
  duration?: string;
}

export function AudioPlayer({ title, duration = "8:32" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
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

  return (
    <div className="rounded-xl bg-bg-card border border-border p-4 md:p-5">
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-amber text-white flex items-center justify-center shrink-0 hover:bg-amber-dark transition-colors shadow-accent"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>

        {/* Info + Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <AudioLines size={14} className="text-amber shrink-0" />
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
