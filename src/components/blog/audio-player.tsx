"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, X, AudioLines, Loader2, ChevronUp } from "lucide-react";
import { useFooterVisibility } from "@/hooks/use-footer-visibility";

interface AudioPlayerProps {
  title: string;
  articleText: string;
  language?: string;
  onClose?: () => void;
}

export function AudioPlayer({
  title,
  articleText,
  language = "BANGLA",
  onClose,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mainPlayerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false); // Guards against concurrent TTS fetches
  const isNearFooter = useFooterVisibility();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMini, setShowMini] = useState(false);

  // Show mini player when main player scrolls fully out of view (above viewport)
  useEffect(() => {
    const el = mainPlayerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isAbove =
          !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        setShowMini(isAbove);
      },
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const loadAudio = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setLoadingStatus("Generating audio…");
    setError(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: articleText,
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

      setLoadingStatus("Preparing playback…");
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
      loadingRef.current = false;
    }
  }, [articleText, language]);

  const handlePlay = useCallback(async () => {
    if (!audioSrc) {
      await loadAudio();
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [audioSrc, loadAudio]);

  // Autoplay once blob is ready
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      const id = setTimeout(() => {
        audioRef.current?.play().catch(() => {});
      }, 100);
      return () => clearTimeout(id);
    }
  }, [audioSrc]);

  // Audio element event wiring
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioSrc]);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    audioRef.current.currentTime = percent * duration;
  };

  const scrollToMain = useCallback(() => {
    mainPlayerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const miniVisible = showMini && !isNearFooter;

  return (
    <>
      {/* ========== MAIN PLAYER (pill shape, single row) ========== */}
      <div ref={mainPlayerRef} className="w-full max-w-[820px] mx-auto">
        <div className="relative rounded-full bg-bg-card border border-border overflow-hidden">
          <div className="relative flex items-center gap-4 p-4 md:p-5">
            {/* Play button */}
            <button
              type="button"
              onClick={handlePlay}
              disabled={loading}
              className="group relative w-[52px] h-[52px] shrink-0 rounded-full bg-text-primary text-bg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={isPlaying ? "Pause" : "Play"}
              aria-busy={loading || undefined}
            >
              {loading ? (
                <Loader2 size={19} className="animate-spin" aria-hidden="true" />
              ) : isPlaying ? (
                <Pause size={18} fill="currentColor" aria-hidden="true" />
              ) : (
                <Play
                  size={18}
                  fill="currentColor"
                  className="ml-0.5"
                  aria-hidden="true"
                />
              )}
            </button>

            {/* Info + progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <AudioLines size={12} className="text-amber shrink-0" />
                <p className="text-[12px] font-semibold text-text-primary font-inter truncate">
                  {loadingStatus || title}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-text-muted font-mono tabular-nums shrink-0 w-8">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressBarRef}
                  onClick={handleSeek}
                  className="flex-1 h-[5px] rounded-full bg-bg-subtle cursor-pointer relative"
                >
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {/* Always-visible progress dot */}
                  <div
                    className="absolute top-1/2 w-3 h-3 rounded-full bg-amber border-2 border-bg-card pointer-events-none"
                    style={{
                      left: `${progressPercent}%`,
                      transform: "translate(-50%, -50%)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[10px] text-text-muted font-mono tabular-nums shrink-0 w-8 text-right">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
                aria-label="Close audio player"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {error && (
            <div className="px-5 py-2 text-[11px] text-error bg-error-soft border-t border-border/60 font-inter">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ========== MINI FLOATING PLAYER ========== */}
      {/* Positioned above the ReadingSettings FAB on mobile so taps don't collide */}
      <div
        aria-hidden={!miniVisible}
        className={`fixed bottom-20 left-4 right-4 md:bottom-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[calc(100%-48px)] md:max-w-[540px] z-[998] transition-all duration-300 ease-out ${
          miniVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div
          className="relative rounded-full bg-bg-card/95 backdrop-blur-xl overflow-hidden"
          style={{
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          {/* Thin progress strip along the top of the pill */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] bg-bg-subtle pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="h-full bg-amber rounded-r-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-3 pl-1.5 pr-2 py-1.5 pt-2">
            {/* Play / pause */}
            <button
              type="button"
              onClick={handlePlay}
              disabled={loading}
              className="w-10 h-10 shrink-0 rounded-full bg-text-primary text-bg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={isPlaying ? "Pause" : "Play"}
              aria-busy={loading || undefined}
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              ) : isPlaying ? (
                <Pause size={14} fill="currentColor" aria-hidden="true" />
              ) : (
                <Play
                  size={14}
                  fill="currentColor"
                  className="ml-0.5"
                  aria-hidden="true"
                />
              )}
            </button>

            {/* Title (also acts as scroll-to-main shortcut) */}
            <button
              type="button"
              onClick={scrollToMain}
              className="flex-1 min-w-0 text-left"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <AudioLines size={10} className="text-amber shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
                  Listening
                </span>
              </div>
              <p className="text-[12px] font-semibold text-text-primary font-inter truncate hover:text-amber transition-colors">
                {title}
              </p>
            </button>

            {/* Time */}
            <span className="text-[10px] text-text-muted font-mono tabular-nums shrink-0 hidden sm:inline">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Jump back to main player */}
            <button
              type="button"
              onClick={scrollToMain}
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
              aria-label="Scroll to main player"
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
