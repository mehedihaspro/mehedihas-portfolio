"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  X,
  AudioLines,
  User,
  UserCircle2,
  Gauge,
  Loader2,
  SkipBack,
  SkipForward,
  ChevronUp,
} from "lucide-react";
import { useFooterVisibility } from "@/hooks/use-footer-visibility";

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
  const mainPlayerRef = useRef<HTMLDivElement | null>(null);
  const isNearFooter = useFooterVisibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [voice, setVoice] = useState<Voice>("female");
  const [speed, setSpeed] = useState<Speed>(1);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMini, setShowMini] = useState(false);

  // Show mini player when main player scrolls fully out of view
  useEffect(() => {
    const el = mainPlayerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show mini if main is above viewport AND audio is loaded
        const isAbove =
          !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        setShowMini(isAbove);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const loadAudio = useCallback(
    async (selectedVoice: Voice) => {
      setLoading(true);
      setLoadingStatus(
        `Generating ${selectedVoice === "female" ? "female" : "male"} voice...`
      );
      setError(null);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: articleText.slice(0, 4900),
            voice: selectedVoice,
            language,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load audio");
          setLoading(false);
          setLoadingStatus("");
          return;
        }

        setLoadingStatus("Preparing playback...");

        const byteCharacters = atob(data.audioContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
        setLoadingStatus("");
      } catch {
        setError("Something went wrong loading audio");
        setLoadingStatus("");
      } finally {
        setLoading(false);
      }
    },
    [articleText, language]
  );

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

  // Auto-play once audio is loaded
  useEffect(() => {
    if (audioSrc && audioRef.current && !isPlaying) {
      const timer = setTimeout(() => {
        audioRef.current?.play().catch(() => {});
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSrc]);

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

  const handleVoiceChange = async (newVoice: Voice) => {
    if (voice === newVoice || loading) return;
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

  const skip = (delta: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(duration, audioRef.current.currentTime + delta)
    );
  };

  const scrollToMain = () => {
    mainPlayerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const speeds: Speed[] = [0.75, 1, 1.25, 1.5, 2];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* ========== MAIN PLAYER (always inline in document flow) ========== */}
      <div
        ref={mainPlayerRef}
        className="w-full max-w-[820px] mx-auto"
      >
        <div className="rounded-[16px] bg-bg-card border border-border overflow-hidden">
          {/* Top row: Play + info */}
          <div className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-4">
            <button
              onClick={handlePlay}
              disabled={loading}
              className="w-[46px] h-[46px] shrink-0 rounded-full bg-amber text-white flex items-center justify-center hover:bg-amber-dark hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100 shadow-[0_4px_12px_rgba(232,168,50,0.3)]"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={17} fill="currentColor" />
              ) : (
                <Play size={17} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <AudioLines size={11} className="text-amber shrink-0" />
                <p className="text-[12px] font-semibold text-text-primary font-inter truncate">
                  {loadingStatus || title}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-text-muted font-mono tabular-nums shrink-0 w-8">
                  {formatTime(currentTime)}
                </span>
                <div
                  onClick={handleSeek}
                  className="flex-1 h-1 rounded-full bg-border cursor-pointer relative group"
                >
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      left: `${progressPercent}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
                <span className="text-[10px] text-text-muted font-mono tabular-nums shrink-0 w-8 text-right">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Skip buttons — hidden on small screens */}
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <button
                onClick={() => skip(-15)}
                disabled={!audioSrc}
                className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors disabled:opacity-40"
                aria-label="Rewind 15 seconds"
              >
                <SkipBack size={15} />
              </button>
              <button
                onClick={() => skip(15)}
                disabled={!audioSrc}
                className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors disabled:opacity-40"
                aria-label="Forward 15 seconds"
              >
                <SkipForward size={15} />
              </button>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
                aria-label="Close audio player"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Bottom controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-5 py-3 border-t border-border bg-bg-subtle/40">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter hidden sm:inline">
                Voice
              </span>
              <div className="flex items-center gap-1 rounded-full bg-bg border border-border p-0.5">
                <button
                  onClick={() => handleVoiceChange("female")}
                  disabled={loading}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium font-inter transition-all disabled:opacity-50 ${
                    voice === "female"
                      ? "bg-amber text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <UserCircle2 size={11} />
                  Female
                </button>
                <button
                  onClick={() => handleVoiceChange("male")}
                  disabled={loading}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium font-inter transition-all disabled:opacity-50 ${
                    voice === "male"
                      ? "bg-amber text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <User size={11} />
                  Male
                </button>
              </div>
            </div>

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
      </div>

      {/* ========== MINI FLOATING PLAYER (appears when scrolled past main) ========== */}
      <div
        className={`fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[calc(100%-48px)] md:max-w-[560px] z-[996] pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showMini && !isNearFooter
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6"
        }`}
      >
        <div
          className="rounded-full bg-bg-card/95 backdrop-blur-xl border border-border overflow-hidden"
          style={{
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center gap-3 pl-1.5 pr-3 py-1.5">
            {/* Play */}
            <button
              onClick={handlePlay}
              disabled={loading}
              className="w-10 h-10 shrink-0 rounded-full bg-amber text-white flex items-center justify-center hover:bg-amber-dark transition-colors disabled:opacity-70"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={14} fill="currentColor" />
              ) : (
                <Play size={14} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {/* Title + progress */}
            <button
              onClick={scrollToMain}
              className="flex-1 min-w-0 text-left group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <AudioLines size={10} className="text-amber shrink-0" />
                <p className="text-[11px] font-semibold text-text-primary font-inter truncate group-hover:text-amber transition-colors">
                  {title}
                </p>
              </div>
              <div className="h-0.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </button>

            {/* Time */}
            <span className="text-[10px] text-text-muted font-mono tabular-nums shrink-0 hidden sm:inline">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Jump to main */}
            <button
              onClick={scrollToMain}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
              aria-label="Scroll to player"
              title="Back to player"
            >
              <ChevronUp size={14} />
            </button>
          </div>
        </div>
      </div>

      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="auto" className="hidden" />
      )}
    </>
  );
}
