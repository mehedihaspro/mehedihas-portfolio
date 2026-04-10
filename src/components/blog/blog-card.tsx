import Link from "next/link";
import { AudioLines, Clock, ArrowRight } from "lucide-react";

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
}: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${slug}`} className="group block">
        <article className="rounded-2xl bg-bg-card border border-border p-6 md:p-8 hover:shadow-md transition-all duration-300">
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-semibold text-amber uppercase tracking-[0.12em]">
              {category}
            </span>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span className="text-[12px] text-text-muted">{date}</span>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span className="text-[12px] text-text-muted inline-flex items-center gap-1">
              <Clock size={11} />
              {readingTime}
            </span>
            {hasAudio && (
              <>
                <span className="w-1 h-1 rounded-full bg-amber" />
                <span className="text-[12px] text-amber inline-flex items-center gap-1 font-medium">
                  <AudioLines size={11} />
                  Audio
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-[28px] md:text-[34px] font-bold text-text-primary leading-[1.15] tracking-tight mb-4 group-hover:text-amber transition-colors duration-200">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-[16px] text-text-secondary leading-[1.7] mb-5 line-clamp-3 max-w-2xl">
            {excerpt}
          </p>

          {/* Read more */}
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber group-hover:gap-2.5 transition-all duration-200">
            Read article
            <ArrowRight size={14} />
          </span>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="py-6 border-b border-border group-last:border-b-0 hover:bg-bg-card -mx-4 px-4 rounded-xl transition-all duration-200">
        {/* Meta row */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="text-[11px] font-semibold text-amber uppercase tracking-[0.12em]">
            {category}
          </span>
          <span className="w-1 h-1 rounded-full bg-text-muted" />
          <span className="text-[11px] text-text-muted">{date}</span>
          {hasAudio && (
            <>
              <span className="w-1 h-1 rounded-full bg-amber" />
              <span className="text-[11px] text-amber inline-flex items-center gap-1 font-medium">
                <AudioLines size={10} />
                Audio
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[20px] font-bold text-text-primary leading-[1.25] mb-2 group-hover:text-amber transition-colors duration-200">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-[14px] text-text-secondary leading-[1.65] line-clamp-2 mb-3 max-w-xl">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3 text-[11px] text-text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {readingTime}
          </span>
          <span className="inline-flex items-center gap-1 text-amber opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Read <ArrowRight size={11} />
          </span>
        </div>
      </article>
    </Link>
  );
}
