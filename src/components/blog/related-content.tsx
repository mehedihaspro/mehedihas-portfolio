import { BlogCard } from "./blog-card";
import { Divider } from "@/components/ui/divider";

interface RelatedPost {
  slug: string | { current: string };
  title: string;
  excerpt?: string;
  category?: string;
  readingTime?: string;
  publishedAt?: string;
  coverColor?: string;
  audioUrl?: string;
  enableAudio?: boolean;
}

interface RelatedContentProps {
  posts: RelatedPost[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RelatedContent({ posts }: RelatedContentProps) {
  if (!posts || posts.length === 0) return null;

  // Max 4 cards
  const display = posts.slice(0, 4);

  return (
    <div className="max-w-[820px] mx-auto mt-16 pt-12 border-t border-border">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-3.5 h-0.5 bg-amber rounded-full" />
        <h4 className="text-[14px] font-bold uppercase tracking-[1.5px] text-text-muted font-inter">
          Related Articles
        </h4>
      </div>

      {/* Vertical list using BlogCard */}
      <div className="flex flex-col gap-6">
        {display.map((post, index) => {
          const slug =
            typeof post.slug === "string" ? post.slug : post.slug.current;
          return (
            <div key={slug}>
              <BlogCard
                slug={slug}
                title={post.title}
                excerpt={post.excerpt || ""}
                category={post.category || "Design"}
                date={post.publishedAt ? formatDate(post.publishedAt) : ""}
                readingTime={post.readingTime || "5 min read"}
                hasAudio={!!post.audioUrl || !!post.enableAudio}
              />
              {index < display.length - 1 && (
                <Divider variant="solid" className="mt-6" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
