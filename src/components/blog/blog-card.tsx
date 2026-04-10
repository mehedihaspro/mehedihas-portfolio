import Link from "next/link";
import { AudioLines, ArrowUpRight, Clock } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  hasAudio?: boolean;
  featured?: boolean;
  coverColor?: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  category,
  date,
  readingTime,
  hasAudio = false,
  featured = false,
  coverColor = "bg-bg-subtle",
}: BlogCardProps) {
  // Generate a gradient from category for posts without coverColor
  const fallbackGradient = coverColor === "bg-bg-subtle"
    ? "bg-gradient-to-br from-amber/20 via-brown/10 to-cream"
    : coverColor;

  if (featured) {
    return (
      <Link href={`/blog/${slug}`} className="group block">
        <article className="grid md:grid-cols-[1.1fr_1fr] gap-0 rounded-2xl overflow-hidden bg-bg-card border border-border hover:shadow-lg transition-all duration-300">
          {/* Cover */}
          <div className={`aspect-[4/3] md:aspect-auto md:min-h-[340px] ${fallbackGradient} relative overflow-hidden`}>
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category + Audio badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {hasAudio && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                  <AudioLines size={11} />
                  Audio
                </span>
              )}
            </div>

            {/* Arrow on hover */}
            <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded-md bg-highlight-bg text-[11px] font-semibold text-amber uppercase tracking-wider">
                {category}
              </span>
              <span className="text-[11px] text-text-muted">{date}</span>
            </div>

            <h2 className="text-2xl md:text-[28px] font-bold text-text-primary leading-[1.2] mb-3 group-hover:text-amber transition-colors duration-200">
              {title}
            </h2>

            <p className="text-[15px] text-text-secondary leading-relaxed mb-5 line-clamp-3">
              {excerpt}
            </p>

            <div className="flex items-center gap-4 text-[12px] text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} />
                {readingTime}
              </span>
              {hasAudio && (
                <span className="inline-flex items-center gap-1.5 text-amber">
                  <AudioLines size={12} />
                  Listen available
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <article className="h-full rounded-2xl overflow-hidden bg-bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        {/* Cover */}
        <div className={`aspect-[16/10] ${fallbackGradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {hasAudio && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-medium border border-white/10">
              <AudioLines size={10} />
              Audio
            </span>
          )}

          {/* Arrow on hover */}
          <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight size={12} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-1.5 py-0.5 rounded bg-highlight-bg text-[10px] font-semibold text-amber uppercase tracking-wider">
              {category}
            </span>
            <span className="text-[10px] text-text-muted">{date}</span>
          </div>

          <h3 className="text-[17px] font-bold text-text-primary leading-snug mb-2 group-hover:text-amber transition-colors duration-200 line-clamp-2">
            {title}
          </h3>

          <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2 mb-3">
            {excerpt}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1">
              <Clock size={11} />
              {readingTime}
            </span>
            {hasAudio && (
              <span className="inline-flex items-center gap-1 text-amber">
                <AudioLines size={11} />
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
