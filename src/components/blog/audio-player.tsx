"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, X, AudioLines, User, UserCircle2, Gauge } from "lucide-react";

interface AudioPlayerProps {
  title: string;
  articleText: string;
  language?: string;
  onClose?: () => void;
}

type Voice = "female" | "male";
type Speed = 0.75 | 1 | 1.25 | 1.5 | 2;

export function AudioPlayer({
  title,
  articleText,
  language = "BANGLA",
  onClose,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voice, setVoice] = useState<Voice>("female");
  const [speed, setSpeed] = useState<Speed>(1);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAudio = async (selectedVoice: Voice) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: articleText.slice(0, 4900), // stay under 5k limit
          voice: selectedVoice,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load audio");
        setLoading(false);
        return;
      }

      // Convert base64 to blob URL
      const byteCharacters = atob(data.audioContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);
    } catch {
      setError("Something went wrong loading audio");
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async () => {
    if (!audioSrc) {
      await loadAudio(voice);
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Reload audio when voice changes (if already loaded)
  const handleVoiceChange = async (newVoice: Voice) => {
    if (voice === newVoice) return;
    setVoice(newVoice);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (audioSrc) {
      URL.revokeObjectURL(audioSrc);
      setAudioSrc(null);
      setCurrentTime(0);
      await loadAudio(newVoice);
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const speeds: Speed[] = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="w-full max-w-[820px] mx-auto">
      <div className="rounded-[14px] bg-bg-subtle border border-border overflow-hidden">
        {/* Top row: Play + info + close */}
        <div className="flex items-center gap-3.5 px-5 py-3.5">
          {/* Play button */}
          <button
            onClick={handlePlay}
            disabled={loading}
            className="w-[42px] h-[42px] shrink-0 rounded-full bg-amber text-white flex items-center justify-center hover:bg-amber-dark hover:scale-105 transition-all disabled:opacity-60 disabled:hover:scale-100"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Title + progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <AudioLines size={11} className="text-amber shrink-0" />
              <p className="text-[12px] font-semibold text-text-primary font-inter truncate">
                {title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted font-mono font-inter tabular-nums shrink-0">
                {formatTime(currentTime)}
              </span>
              <div
                onClick={handleSeek}
                className="flex-1 h-1 rounded-full bg-border cursor-pointer relative"
              >
                <div
                  className="h-full rounded-full bg-amber transition-[width]"
                  style={{
                    width:
                      duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
                  }}
                />
              </div>
              <span className="text-[10px] text-text-muted font-mono font-inter tabular-nums shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors shrink-0"
              aria-label="Close audio player"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Bottom row: controls */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border bg-bg/50">
          {/* Voice toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted font-inter">
              Voice
            </span>
            <div className="flex items-center gap-1 rounded-full bg-bg border border-border p-0.5">
              <button
                onClick={() => handleVoiceChange("female")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium font-inter transition-colors ${
                  voice === "female"
                    ? "bg-amber text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <UserCircle2 size={11} />
                Female
              </button>
              <button
                onClick={() => handleVoiceChange("male")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium font-inter transition-colors ${
                  voice === "male"
                    ? "bg-amber text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <User size={11} />
                Male
              </button>
            </div>
          </div>

          {/* Speed */}
          <div className="flex items-center gap-2">
            <Gauge size={12} className="text-text-muted" />
            <div className="flex items-center gap-0.5 rounded-full bg-bg border border-border p-0.5">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono font-inter transition-colors ${
                    speed === s
                      ? "bg-amber text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="px-5 py-2 text-[11px] text-red-500 bg-red-500/10 border-t border-red-500/20 font-inter">
            {error}
          </div>
        )}
      </div>

      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="auto" className="hidden" />
      )}
    </div>
  );
}
