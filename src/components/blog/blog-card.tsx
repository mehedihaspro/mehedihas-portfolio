import Link from "next/link";

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
  if (featured) {
    return (
      <Link href={`/blog/${slug}`} className="group block">
        <article className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-bg-card border border-border hover:shadow-lg transition-shadow duration-300">
          {/* Cover */}
          <div
            className={`aspect-[4/3] md:aspect-auto ${coverColor} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {hasAudio && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium">
                <AudioWaveIcon />
                Audio
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">
                {category}
              </span>
              <span className="text-text-muted text-[11px]">&middot;</span>
              <span className="text-[11px] text-text-muted">{date}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 group-hover:text-amber transition-colors duration-200">
              {title}
            </h2>

            <p className="text-base text-text-secondary leading-relaxed mb-4 line-clamp-3">
              {excerpt}
            </p>

            <div className="flex items-center gap-3 text-[12px] text-text-muted">
              <span>{readingTime}</span>
              {hasAudio && (
                <>
                  <span>&middot;</span>
                  <span className="inline-flex items-center gap-1">
                    <AudioWaveIcon />
                    Listen available
                  </span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="h-full rounded-xl overflow-hidden bg-bg-card border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        {/* Cover */}
        <div className={`aspect-[16/10] ${coverColor} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {hasAudio && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-medium">
              <AudioWaveIcon />
              Audio
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold text-amber uppercase tracking-wider">
              {category}
            </span>
            <span className="text-text-muted text-[10px]">&middot;</span>
            <span className="text-[10px] text-text-muted">{date}</span>
          </div>

          <h3 className="text-lg font-bold text-text-primary leading-snug mb-2 group-hover:text-amber transition-colors duration-200 line-clamp-2">
            {title}
          </h3>

          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-3">
            {excerpt}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span>{readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function AudioWaveIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0"
    >
      <rect x="1" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.7" />
      <rect x="3.5" y="2.5" width="1.5" height="7" rx="0.75" fill="currentColor" opacity="0.85" />
      <rect x="6" y="3.5" width="1.5" height="5" rx="0.75" fill="currentColor" />
      <rect x="8.5" y="1" width="1.5" height="10" rx="0.75" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
