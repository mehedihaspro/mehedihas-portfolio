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
  ChevronUp,
  ChevronDown,
  Check,
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

const SPEEDS: Speed[] = [0.75, 1, 1.25, 1.5, 2];

export function AudioPlayer({
  title,
  articleText,
  language = "BANGLA",
  onClose,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mainPlayerRef = useRef<HTMLDivElement | null>(null);
  const voiceDropdownRef = useRef<HTMLDivElement | null>(null);
  const speedDropdownRef = useRef<HTMLDivElement | null>(null);
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
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);

  // Show mini player when main player scrolls fully out of view
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        voiceDropdownRef.current &&
        !voiceDropdownRef.current.contains(e.target as Node)
      ) {
        setVoiceOpen(false);
      }
      if (
        speedDropdownRef.current &&
        !speedDropdownRef.current.contains(e.target as Node)
      ) {
        setSpeedOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    setVoiceOpen(false);
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

  const scrollToMain = () => {
    mainPlayerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const voiceLabel = voice === "female" ? "Female" : "Male";

  return (
    <>
      {/* ========== MAIN PLAYER ========== */}
      <div ref={mainPlayerRef} className="w-full max-w-[820px] mx-auto">
        <div
          className="relative rounded-[20px] bg-bg-card overflow-hidden"
          style={{
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          {/* Ambient glow behind play button */}
          <div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{
              background: "radial-gradient(circle, var(--amber) 0%, transparent 70%)",
            }}
          />

          <div className="relative flex items-center gap-4 p-4 md:p-5">
            {/* Play button */}
            <button
              onClick={handlePlay}
              disabled={loading}
              className="group relative w-[52px] h-[52px] shrink-0 rounded-full bg-amber text-white flex items-center justify-center hover:bg-amber-dark hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100"
              aria-label={isPlaying ? "Pause" : "Play"}
              style={{
                boxShadow:
                  "0 6px 20px rgba(232,168,50,0.35), 0 2px 6px rgba(232,168,50,0.2)",
              }}
            >
              {/* Subtle pulsing ring when playing */}
              {isPlaying && !loading && (
                <span className="absolute inset-0 rounded-full bg-amber animate-ping opacity-25" />
              )}
              {loading ? (
                <Loader2 size={19} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
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
                  onClick={handleSeek}
                  className="flex-1 h-[5px] rounded-full bg-bg-subtle cursor-pointer relative group"
                >
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div
                    className="absolute top-1/2 w-3.5 h-3.5 rounded-full bg-amber border-[3px] border-bg-card shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Bottom controls row */}
          <div className="relative flex items-center justify-between gap-3 px-4 md:px-5 py-3 border-t border-border/60 bg-bg-subtle/30">
            {/* Voice dropdown */}
            <div className="relative" ref={voiceDropdownRef}>
              <button
                onClick={() => setVoiceOpen(!voiceOpen)}
                disabled={loading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-card transition-all disabled:opacity-50 ${
                  voiceOpen ? "ring-[1.5px] ring-amber" : "hover:bg-cream"
                }`}
                style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.05)" }}
              >
                {voice === "female" ? (
                  <UserCircle2 size={12} className="text-amber" />
                ) : (
                  <User size={12} className="text-amber" />
                )}
                <span className="text-[11px] font-semibold text-text-primary font-inter">
                  {voiceLabel}
                </span>
                <ChevronDown
                  size={11}
                  className={`text-text-muted transition-transform ${
                    voiceOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {voiceOpen && (
                <div
                  className="absolute left-0 bottom-full mb-2 w-[160px] rounded-[12px] bg-bg-card overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-1 duration-150"
                  style={{
                    boxShadow:
                      "0 12px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter">
                    Voice
                  </div>
                  {(["female", "male"] as const).map((v) => {
                    const active = voice === v;
                    const VIcon = v === "female" ? UserCircle2 : User;
                    return (
                      <button
                        key={v}
                        onClick={() => handleVoiceChange(v)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                          active ? "bg-highlight-bg" : "hover:bg-bg-subtle"
                        }`}
                      >
                        <VIcon size={13} className={active ? "text-amber" : "text-text-secondary"} />
                        <span
                          className={`flex-1 text-[12px] font-medium font-inter ${
                            active ? "text-amber" : "text-text-primary"
                          }`}
                        >
                          {v === "female" ? "Female" : "Male"}
                        </span>
                        {active && <Check size={12} className="text-amber" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Speed dropdown */}
            <div className="relative" ref={speedDropdownRef}>
              <button
                onClick={() => setSpeedOpen(!speedOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-card transition-all ${
                  speedOpen ? "ring-[1.5px] ring-amber" : "hover:bg-cream"
                }`}
                style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.05)" }}
              >
                <Gauge size={12} className="text-amber" />
                <span className="text-[11px] font-semibold text-text-primary font-inter font-mono tabular-nums">
                  {speed}x
                </span>
                <ChevronDown
                  size={11}
                  className={`text-text-muted transition-transform ${
                    speedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {speedOpen && (
                <div
                  className="absolute right-0 bottom-full mb-2 w-[130px] rounded-[12px] bg-bg-card overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-1 duration-150"
                  style={{
                    boxShadow:
                      "0 12px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter">
                    Speed
                  </div>
                  {SPEEDS.map((s) => {
                    const active = speed === s;
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          setSpeed(s);
                          setSpeedOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                          active ? "bg-highlight-bg" : "hover:bg-bg-subtle"
                        }`}
                      >
                        <span
                          className={`flex-1 text-[12px] font-semibold font-mono tabular-nums font-inter ${
                            active ? "text-amber" : "text-text-primary"
                          }`}
                        >
                          {s}x
                        </span>
                        {active && <Check size={12} className="text-amber" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="px-5 py-2 text-[11px] text-red-500 bg-red-500/10 border-t border-red-500/20 font-inter">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ========== MINI FLOATING PLAYER ========== */}
      <div
        className={`fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[calc(100%-48px)] md:max-w-[540px] z-[996] pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showMini && !isNearFooter
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6"
        }`}
      >
        <div
          className="relative rounded-full bg-bg-card/95 backdrop-blur-xl overflow-hidden"
          style={{
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          {/* Progress strip at the top of the pill */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-bg-subtle">
            <div
              className="h-full bg-amber rounded-r-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 pt-2">
            {/* Play */}
            <button
              onClick={handlePlay}
              disabled={loading}
              className="w-10 h-10 shrink-0 rounded-full bg-amber text-white flex items-center justify-center hover:bg-amber-dark transition-colors disabled:opacity-70"
              aria-label={isPlaying ? "Pause" : "Play"}
              style={{
                boxShadow: "0 4px 12px rgba(232,168,50,0.35)",
              }}
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={14} fill="currentColor" />
              ) : (
                <Play size={14} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {/* Title */}
            <button
              onClick={scrollToMain}
              className="flex-1 min-w-0 text-left group"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <AudioLines size={10} className="text-amber shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
                  Listening
                </span>
              </div>
              <p className="text-[12px] font-semibold text-text-primary font-inter truncate group-hover:text-amber transition-colors">
                {title}
              </p>
            </button>

            {/* Time */}
            <span className="text-[10px] text-text-muted font-mono tabular-nums shrink-0 hidden sm:inline">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Jump to main */}
            <button
              onClick={scrollToMain}
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
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
