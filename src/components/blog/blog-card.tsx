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
      <article className="flex gap-6 items-center">
        {/* Image — 308x308 square with 14px radius */}
        <div className="w-[308px] h-[308px] shrink-0 rounded-[14px] bg-cream border border-border overflow-hidden relative">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
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
            <div className="absolute top-3 left-3 flex items-center gap-2 px-4 py-2 rounded-full bg-bg border border-border">
              <AudioLines size={16} className="text-text-secondary" />
              <span className="text-[12px] font-medium text-text-secondary leading-[18px]">
                Audio
              </span>
            </div>
          )}
        </div>

        {/* Article content */}
        <div className="flex-1 flex flex-col gap-4 justify-center min-w-0">
          {/* Meta: Category · Date · Reading time */}
          <p className="text-[12px] font-medium text-text-secondary leading-[18px] truncate">
            {category}  ·  {date}  ·  {readingTime}
          </p>

          {/* Title — Inter Bold 27px/38px */}
          <h2 className="text-[27px] font-bold text-text-primary leading-[38px] group-hover:text-amber transition-colors duration-200 font-inter">
            {title}
          </h2>

          {/* Excerpt — Inter Regular 16px/25.88px, 3 line clamp */}
          <p className="text-[16px] font-normal text-text-secondary leading-[25.88px] line-clamp-3 font-inter">
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
