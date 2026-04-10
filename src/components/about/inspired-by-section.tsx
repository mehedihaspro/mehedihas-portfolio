"use client";

import { useState } from "react";
import { Music, Book, Film, Tv, Headphones, Gamepad2 } from "lucide-react";

interface InspiredItem {
  type: "music" | "book" | "film" | "series" | "podcast" | "game";
  title: string;
  creator: string;
  color: string;
  note: string;
}

const TYPE_META = {
  music: { Icon: Music, label: "Music", aspect: "aspect-square" },
  book: { Icon: Book, label: "Book", aspect: "aspect-[2/3]" },
  film: { Icon: Film, label: "Film", aspect: "aspect-[2/3]" },
  series: { Icon: Tv, label: "Series", aspect: "aspect-video" },
  podcast: { Icon: Headphones, label: "Podcast", aspect: "aspect-square" },
  game: { Icon: Gamepad2, label: "Game", aspect: "aspect-[3/4]" },
};

const ITEMS: InspiredItem[] = [
  {
    type: "music",
    title: "For Emma, Forever Ago",
    creator: "Bon Iver",
    color: "#2D3E50",
    note: "Recorded alone in a cabin. Proof that constraints make better work.",
  },
  {
    type: "book",
    title: "Ruined by Design",
    creator: "Mike Monteiro",
    color: "#C0392B",
    note: "The book that made me take design ethics seriously.",
  },
  {
    type: "film",
    title: "The Grand Budapest Hotel",
    creator: "Wes Anderson",
    color: "#D4A574",
    note: "Every frame is a lesson in hierarchy, composition, and color.",
  },
  {
    type: "series",
    title: "Severance",
    creator: "Dan Erickson",
    color: "#1E2A3A",
    note: "The opening credits alone are a masterclass in motion design.",
  },
  {
    type: "podcast",
    title: "Design Matters",
    creator: "Debbie Millman",
    color: "#8B6B4A",
    note: "Two decades of conversations that shaped how designers think.",
  },
  {
    type: "game",
    title: "Disco Elysium",
    creator: "ZA/UM",
    color: "#4A3F6B",
    note: "A game with no combat but the deepest writing I've ever played.",
  },
];

const FILTER_TYPES = ["all", "music", "book", "film", "series", "podcast", "game"] as const;

export function InspiredBySection() {
  const [filter, setFilter] = useState<(typeof FILTER_TYPES)[number]>("all");
  const [activeItem, setActiveItem] = useState<InspiredItem | null>(null);

  const filteredItems =
    filter === "all" ? ITEMS : ITEMS.filter((item) => item.type === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_TYPES.map((type) => {
          const isActive = filter === type;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-[12px] font-medium uppercase tracking-[0.1em] border transition-all duration-200 font-inter ${
                isActive
                  ? "bg-text-primary border-text-primary text-bg"
                  : "bg-bg border-border text-text-secondary hover:border-text-muted"
              }`}
            >
              {type === "all" ? "All" : TYPE_META[type as keyof typeof TYPE_META].label}
            </button>
          );
        })}
      </div>

      {/* Grid of inspired items */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredItems.map((item, idx) => {
          const meta = TYPE_META[item.type];
          const TypeIcon = meta.Icon;
          return (
            <button
              key={`${item.type}-${item.title}-${idx}`}
              onClick={() => setActiveItem(item)}
              className="group flex flex-col text-left focus:outline-none"
            >
              {/* Cover */}
              <div
                className={`w-full ${meta.aspect} rounded-lg relative overflow-hidden mb-3 transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-xl`}
                style={{
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 50%, ${item.color}88 100%)`,
                }}
              >
                {/* Noise texture */}
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Type badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                  <TypeIcon size={10} className="text-white" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-white font-inter">
                    {meta.label}
                  </span>
                </div>

                {/* Hover reveal */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-[11px] text-white/90 font-inter italic leading-snug">
                    Click to read why
                  </p>
                </div>
              </div>

              {/* Title */}
              <p className="text-[13px] font-bold text-text-primary font-inter leading-tight mb-0.5 group-hover:text-amber transition-colors line-clamp-1">
                {item.title}
              </p>
              <p className="text-[11px] text-text-muted font-inter line-clamp-1">
                {item.creator}
              </p>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {activeItem && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setActiveItem(null)}
          />

          {/* Modal panel */}
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-[560px] rounded-3xl bg-bg border border-border p-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-start gap-6">
                {/* Cover */}
                <div
                  className="w-32 aspect-[2/3] rounded-xl shrink-0 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${activeItem.color} 0%, ${activeItem.color}cc 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 font-inter"
                    style={{ color: activeItem.color }}
                  >
                    {TYPE_META[activeItem.type].label}
                  </p>
                  <h3 className="text-[22px] font-bold text-text-primary font-inter leading-tight mb-1">
                    {activeItem.title}
                  </h3>
                  <p className="text-[14px] text-text-secondary font-inter mb-4">
                    by {activeItem.creator}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-border mb-4" />

                  {/* Note */}
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2 font-inter">
                    Why it inspires me
                  </p>
                  <p className="font-handwriting text-[18px] text-text-primary leading-snug">
                    {activeItem.note}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setActiveItem(null)}
                className="mt-6 w-full h-10 rounded-full bg-bg-subtle hover:bg-cream text-[13px] font-medium text-text-secondary font-inter transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
