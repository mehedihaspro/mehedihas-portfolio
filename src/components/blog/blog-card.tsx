import Link from "next/link";
import Image from "next/image";
import { AudioLines } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  hasAudio?: boolean;
  coverImage?: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  category,
  date,
  readingTime,
  hasAudio = false,
  coverImage,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      {/*
        Responsive layout:
        - Below 768px: stacked (image top, content bottom)
        - 768px+: side by side (image left, content right)
      */}
      <article className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Image */}
        <div
          className="
            relative shrink-0 rounded-[14px] bg-cream border border-border overflow-hidden
            w-full aspect-[16/10]
            md:w-[240px] md:aspect-square
            lg:w-[308px] lg:h-[308px] lg:aspect-auto
          "
        >
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 240px, 308px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt=""
                width={64}
                height={52}
                className="opacity-20"
              />
            </div>
          )}

          {/* Audio badge */}
          {hasAudio && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg border border-border">
              <AudioLines size={14} className="text-text-secondary" />
              <span className="text-[11px] md:text-[12px] font-medium text-text-secondary leading-[18px]">
                Audio
              </span>
            </div>
          )}
        </div>

        {/* Article content */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4 justify-center min-w-0">
          {/* Meta: Category · Date · Reading time */}
          <p className="text-[11px] md:text-[12px] font-medium text-text-secondary leading-[18px] truncate">
            {category} &middot; {date} &middot; {readingTime}
          </p>

          {/* Title — responsive sizes */}
          <h2 className="text-[20px] md:text-[22px] lg:text-[27px] font-bold text-text-primary leading-[1.3] md:leading-[1.3] lg:leading-[38px] group-hover:text-amber transition-colors duration-200 font-inter">
            {title}
          </h2>

          {/* Excerpt — hidden on very small screens if needed, 3 lines max */}
          <p className="text-[14px] md:text-[15px] lg:text-[16px] font-normal text-text-secondary leading-[1.65] lg:leading-[25.88px] line-clamp-3 font-inter">
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
