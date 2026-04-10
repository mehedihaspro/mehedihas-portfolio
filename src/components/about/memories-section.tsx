"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface Memory {
  title: string;
  caption: string;
  story: string;
  date: string;
  location: string;
  color: string;
  rotation: number;
  tapeColor: string;
}

const MEMORIES: Memory[] = [
  {
    title: "First design talk",
    caption: "Nervously excited",
    story:
      "My first ever talk at a local design meetup. I had 30 slides for a 15-minute slot and shook the entire time. Someone in the front row was nodding along and I fixated on them the whole talk. Afterwards they told me they were just confused.",
    date: "October 2022",
    location: "Dhaka, Bangladesh",
    color: "#8B6B4A",
    rotation: -4,
    tapeColor: "#E8A832",
  },
  {
    title: "Workshop day",
    caption: "30 designers, one whiteboard",
    story:
      "Ran my first design workshop for 30 people. The whiteboard was barely big enough. Half the attendees stayed two hours extra just to keep talking. That was the day I realized teaching might be what I actually love.",
    date: "March 2023",
    location: "Chittagong, Bangladesh",
    color: "#2D5F2D",
    rotation: 3,
    tapeColor: "#E8A832",
  },
  {
    title: "Team offsite",
    caption: "Design system sprint",
    story:
      "Three days locked in a room with the team, trying to wrestle our design system into shape. We argued about button padding for 45 minutes. We also built something I'm still proud of.",
    date: "June 2024",
    location: "Cox's Bazar",
    color: "#4A3F6B",
    rotation: -2,
    tapeColor: "#E8A832",
  },
  {
    title: "Late night session",
    caption: "Coffee & prototypes",
    story:
      "The launch was in 48 hours and the prototype wasn't right. I ordered my fourth coffee and my third pack of instant noodles. Finished at 4am. Shipped. User feedback the next day made it all worth it.",
    date: "January 2024",
    location: "Home studio",
    color: "#6B4A4A",
    rotation: 5,
    tapeColor: "#E8A832",
  },
  {
    title: "Conference badge",
    caption: "Speaker — Design Week",
    story:
      "First time I had a badge that said 'Speaker' on it. I took a photo of it in the bathroom mirror because I was too shy to ask someone else. I still have the badge in a drawer.",
    date: "November 2024",
    location: "Design Week",
    color: "#C48A1A",
    rotation: -3,
    tapeColor: "#E8A832",
  },
  {
    title: "Mentorship call",
    caption: "Portfolio reviews",
    story:
      "A designer I mentored for six months landed her dream job. She sent me a screenshot of the offer at 11pm. I cried a little. This is the part of the job I never expected to love this much.",
    date: "February 2026",
    location: "Zoom",
    color: "#1E2A3A",
    rotation: 2,
    tapeColor: "#E8A832",
  },
];

export function MemoriesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const active = activeIdx !== null ? MEMORIES[activeIdx] : null;

  // Lock body scroll when modal open
  useEffect(() => {
    if (activeIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIdx]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowLeft" && activeIdx > 0)
        setActiveIdx(activeIdx - 1);
      if (e.key === "ArrowRight" && activeIdx < MEMORIES.length - 1)
        setActiveIdx(activeIdx + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-14 py-8">
        {MEMORIES.map((memory, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="group relative cursor-pointer transition-transform duration-700 ease-out focus:outline-none"
            style={{
              transform:
                hoveredIdx === idx
                  ? "rotate(0deg) scale(1.06) translateY(-10px)"
                  : `rotate(${memory.rotation}deg)`,
              zIndex: hoveredIdx === idx ? 10 : 1,
            }}
            aria-label={`View memory: ${memory.title}`}
          >
            {/* Polaroid frame with realistic layering */}
            <div
              className="relative bg-[#fdfaf4] rounded-[2px] p-3 pb-[52px] transition-all duration-500"
              style={{
                boxShadow:
                  hoveredIdx === idx
                    ? "0 30px 60px -15px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.03)"
                    : "0 12px 28px -8px rgba(0, 0, 0, 0.18), 0 4px 10px -2px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(0, 0, 0, 0.03)",
              }}
            >
              {/* Subtle paper texture on frame */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply rounded-[2px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Photo */}
              <div
                className="relative aspect-[4/5] overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${memory.color} 0%, ${memory.color}dd 50%, ${memory.color}aa 100%)`,
                }}
              >
                {/* Photo grain */}
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Color gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />

                {/* Vignette */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)",
                  }}
                />
              </div>

              {/* Tape accent — at top, overlapping the photo */}
              <div
                className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-5 rounded-sm"
                style={{
                  backgroundColor: `${memory.tapeColor}40`,
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.3)",
                }}
              />

              {/* Handwritten caption */}
              <div className="absolute bottom-3 left-0 right-0 text-center px-3">
                <p className="font-handwriting text-[19px] text-[#36322d] leading-tight">
                  {memory.title}
                </p>
                <p className="font-handwriting text-[13px] text-[#6B5D4F] leading-tight mt-0.5">
                  {memory.caption}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Expanded modal */}
      {active && activeIdx !== null && (
        <>
          <div
            className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setActiveIdx(null)}
          />

          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-[520px] animate-in fade-in zoom-in-95 duration-400">
              {/* Close button */}
              <button
                onClick={() => setActiveIdx(null)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Prev/Next nav */}
              {activeIdx > 0 && (
                <button
                  onClick={() => setActiveIdx(activeIdx - 1)}
                  className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              {activeIdx < MEMORIES.length - 1 && (
                <button
                  onClick={() => setActiveIdx(activeIdx + 1)}
                  className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              )}

              {/* Large polaroid */}
              <div
                className="relative bg-[#fdfaf4] rounded-[2px] p-5 pb-[72px]"
                style={{
                  boxShadow:
                    "0 40px 80px -20px rgba(0, 0, 0, 0.5), 0 16px 32px -8px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Paper texture */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none mix-blend-multiply"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Photo */}
                <div
                  className="relative aspect-[4/5] overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${active.color} 0%, ${active.color}dd 50%, ${active.color}aa 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)",
                    }}
                  />
                </div>

                {/* Tape */}
                <div
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 rounded-sm"
                  style={{
                    backgroundColor: `${active.tapeColor}50`,
                    boxShadow:
                      "0 2px 5px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.4)",
                  }}
                />

                {/* Caption + date + location */}
                <div className="absolute bottom-4 left-0 right-0 px-5 text-center">
                  <p className="font-handwriting text-[26px] text-[#36322d] leading-tight mb-0.5">
                    {active.title}
                  </p>
                  <p className="font-handwriting text-[18px] text-[#6B5D4F] leading-tight">
                    {active.caption}
                  </p>
                </div>
              </div>

              {/* Story card below polaroid */}
              <div className="mt-6 rounded-2xl bg-bg border border-border p-6">
                <div className="flex items-center gap-4 mb-4 text-[12px] text-text-muted font-inter">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {active.date}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-text-muted" />
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {active.location}
                  </span>
                </div>

                <p className="text-[14px] text-text-secondary leading-[1.75] font-inter">
                  {active.story}
                </p>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] text-text-muted font-inter">
                  <span>
                    {activeIdx + 1} of {MEMORIES.length}
                  </span>
                  <span className="uppercase tracking-wider">
                    Use ← → keys
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
