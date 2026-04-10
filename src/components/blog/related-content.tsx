import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

interface RelatedPost {
  slug: string | { current: string };
  title: string;
  excerpt?: string;
  category?: string;
  readingTime?: string;
  coverColor?: string;
}

interface RelatedContentProps {
  posts: RelatedPost[];
}

export function RelatedContent({ posts }: RelatedContentProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="max-w-[820px] mx-auto mt-16 pt-12 border-t border-border">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3.5 h-0.5 bg-amber rounded-full" />
        <h4 className="text-[14px] font-bold uppercase tracking-[1.5px] text-text-muted font-inter">
          Related Articles
        </h4>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {posts.map((post) => {
          const slug =
            typeof post.slug === "string" ? post.slug : post.slug.current;
          const coverBg = post.coverColor
            ? `bg-[${post.coverColor}]`
            : "bg-bg-subtle";
          return (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="group block rounded-[14px] border border-border bg-bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              {/* Cover */}
              <div className={`aspect-[16/10] ${coverBg} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/15" />
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={12} />
                </div>
              </div>

              <div className="p-4">
                {post.category && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber mb-2 font-inter">
                    {post.category}
                  </p>
                )}
                <h3 className="text-[15px] font-bold text-text-primary leading-snug mb-2 line-clamp-2 group-hover:text-amber transition-colors font-inter">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-2 mb-3 font-inter">
                    {post.excerpt}
                  </p>
                )}
                {post.readingTime && (
                  <p className="text-[11px] text-text-muted font-inter inline-flex items-center gap-1">
                    <Clock size={10} />
                    {post.readingTime}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
