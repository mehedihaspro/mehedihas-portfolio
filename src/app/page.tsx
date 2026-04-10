import Link from "next/link";
import { AudioLines, ArrowRight } from "lucide-react";
import { sanityClient } from "@/lib/sanity/client";
import { featuredPostsQuery, allProjectsQuery, authorQuery } from "@/lib/sanity/queries";

export const revalidate = 60;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function HomePage() {
  let posts: Array<{ slug: string; title: string; category: string; readingTime: string; hasAudio: boolean }> = [];
  let projects: Array<{ slug: string; title: string; description: string; role: string; coverColor: string }> = [];
  let author: { currentlyReading?: string; currentlyDesigning?: string; currentlyLearning?: string } | null = null;

  try {
    const [sanityPosts, sanityProjects, sanityAuthor] = await Promise.all([
      sanityClient.fetch(featuredPostsQuery),
      sanityClient.fetch(allProjectsQuery),
      sanityClient.fetch(authorQuery),
    ]);

    if (sanityPosts?.length) {
      posts = sanityPosts.map((p: { slug: { current: string }; title: string; category: string; readingTime: string; audioUrl: string }) => ({
        slug: p.slug.current,
        title: p.title,
        category: p.category,
        readingTime: p.readingTime || "5 min",
        hasAudio: !!p.audioUrl,
      }));
    }

    if (sanityProjects?.length) {
      projects = sanityProjects.slice(0, 2).map((p: { slug: { current: string }; title: string; overview: string; role: string; coverColor: string }) => ({
        slug: p.slug.current,
        title: p.title,
        description: p.overview || "",
        role: p.role || "Designer",
        coverColor: p.coverColor ? `bg-[${p.coverColor}]` : "bg-bg-subtle",
      }));
    }

    if (sanityAuthor) author = sanityAuthor;
  } catch {
    // Sanity fetch failed
  }

  const currently = [
    author?.currentlyDesigning && { label: "Designing", value: author.currentlyDesigning },
    author?.currentlyLearning && { label: "Learning", value: author.currentlyLearning },
    author?.currentlyReading && { label: "Reading", value: author.currentlyReading },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Hero */}
      <section className="pt-20 md:pt-32 pb-16">
        <div className="max-w-3xl">
          <h1 className="text-[clamp(32px,5.5vw,56px)] font-bold text-text-primary leading-[1.1] tracking-tight mb-6">
            Designing experiences
            <br />
            that make people{" "}
            <span className="text-amber">think</span> &{" "}
            <span className="text-amber">feel</span>.
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed max-w-xl mb-8">
            I explore the intersection of design, psychology, and storytelling
            — crafting products and content that resonate with people.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/work"
              className="h-10 px-5 inline-flex items-center justify-center rounded-xl bg-text-primary text-bg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              View my work
            </Link>
            <Link
              href="/blog"
              className="h-10 px-5 inline-flex items-center justify-center rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-bg-subtle hover:text-text-primary transition-colors"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      {/* Currently */}
      {currently.length > 0 && (
        <section className="py-8 mb-8">
          <div className="flex flex-wrap gap-3">
            {currently.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-bg-card border border-border"
              >
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-[13px] text-text-primary font-medium">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Work */}
      {projects.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em]">
              Featured Work
            </h2>
            <Link href="/work" className="text-[12px] text-amber font-medium hover:text-amber-dark transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link key={project.slug} href={`/work/${project.slug}`} className="group block">
                <div className="rounded-2xl overflow-hidden bg-bg-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className={`aspect-[16/10] ${project.coverColor} relative`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="text-[11px] font-semibold text-amber uppercase tracking-wider mb-2">{project.role}</p>
                    <h3 className="text-xl font-bold text-text-primary mb-1 group-hover:text-amber transition-colors">{project.title}</h3>
                    <p className="text-sm text-text-secondary">{project.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Writing */}
      {posts.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em]">
              Latest Writing
            </h2>
            <Link href="/blog" className="text-[12px] text-amber font-medium hover:text-amber-dark transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="space-y-1">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between gap-4 py-4 px-4 -mx-4 rounded-xl hover:bg-bg-card transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {post.hasAudio && (
                    <span className="shrink-0 w-6 h-6 rounded-full bg-highlight-bg flex items-center justify-center">
                      <AudioLines size={12} className="text-amber" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-text-primary truncate group-hover:text-amber transition-colors">{post.title}</h3>
                    <p className="text-[12px] text-text-muted">{post.category} &middot; {post.readingTime}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="shrink-0 text-text-muted group-hover:text-amber group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 border-t border-border">
        <div className="rounded-2xl bg-bg-card border border-border p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
            Design insights, delivered.
          </h2>
          <p className="text-base text-text-secondary max-w-md mx-auto mb-6">
            Join designers and creators who read my weekly newsletter on design
            thinking, psychology, and building products.
          </p>
          <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-11 px-4 rounded-xl bg-bg-subtle border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-highlight-bg transition-all"
              readOnly
            />
            <button className="h-11 px-6 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber-dark transition-colors shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
