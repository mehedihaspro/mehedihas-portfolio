import Link from "next/link";

// Sample data — will be replaced with Sanity queries
const FEATURED_PROJECTS = [
  {
    slug: "fintech-redesign",
    title: "Fintech App Redesign",
    description: "End-to-end product design for a mobile banking experience",
    role: "Lead Designer",
    coverColor: "bg-[#1E2A3A]",
  },
  {
    slug: "healthcare-dashboard",
    title: "Healthcare Dashboard",
    description: "Data visualization system for patient management",
    role: "Product Designer",
    coverColor: "bg-[#2D5F2D]",
  },
];

const LATEST_POSTS = [
  {
    slug: "duolingo-streak-psychology",
    title: "Duolingo এর সবুজ পাখি কেন আপনাকে ছাড়ে না",
    category: "Design Psychology",
    readingTime: "8 min",
    hasAudio: true,
  },
  {
    slug: "figma-variables-complete-guide",
    title: "Figma Variables দিয়ে Design System তৈরি",
    category: "Design System",
    readingTime: "12 min",
    hasAudio: true,
  },
  {
    slug: "why-designers-should-write",
    title: "ডিজাইনারদের কেন লেখালেখি করা উচিত?",
    category: "Career",
    readingTime: "5 min",
    hasAudio: false,
  },
];

const ROLES = [
  "Product Designer",
  "Author",
  "Content Creator",
  "Mentor",
  "Lead Designer",
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-bg-subtle border border-border" />
            <div>
              <p className="text-sm font-semibold text-text-primary">
                mehedihas
              </p>
              <p className="text-[12px] text-text-muted">
                {ROLES.join(" · ")}
              </p>
            </div>
          </div>

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
      <section className="py-8 mb-8">
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Designing", value: "Design System v2" },
            { label: "Writing", value: "Newsletter #12" },
            { label: "Reading", value: "Refactoring UI" },
          ].map((item) => (
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

      {/* Featured Work */}
      <section className="py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em]">
            Featured Work
          </h2>
          <Link
            href="/work"
            className="text-[12px] text-amber font-medium hover:text-amber-dark transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURED_PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/work`}
              className="group block"
            >
              <div className="rounded-2xl overflow-hidden bg-bg-card border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div
                  className={`aspect-[16/10] ${project.coverColor} relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5 md:p-6">
                  <p className="text-[11px] font-semibold text-amber uppercase tracking-wider mb-2">
                    {project.role}
                  </p>
                  <h3 className="text-xl font-bold text-text-primary mb-1 group-hover:text-amber transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {project.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Writing */}
      <section className="py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em]">
            Latest Writing
          </h2>
          <Link
            href="/blog"
            className="text-[12px] text-amber font-medium hover:text-amber-dark transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="space-y-1">
          {LATEST_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-center justify-between gap-4 py-4 px-4 -mx-4 rounded-xl hover:bg-bg-card transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                {post.hasAudio && (
                  <span className="shrink-0 w-6 h-6 rounded-full bg-highlight-bg flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-amber">
                      <rect x="0.5" y="3" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.6" />
                      <rect x="3" y="1.5" width="1.5" height="7" rx="0.75" fill="currentColor" opacity="0.8" />
                      <rect x="5.5" y="2.5" width="1.5" height="5" rx="0.75" fill="currentColor" />
                      <rect x="8" y="0.5" width="1.5" height="9" rx="0.75" fill="currentColor" opacity="0.6" />
                    </svg>
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-text-primary truncate group-hover:text-amber transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[12px] text-text-muted">
                    {post.category} &middot; {post.readingTime}
                  </p>
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="shrink-0 text-text-muted group-hover:text-amber group-hover:translate-x-0.5 transition-all"
              >
                <line x1="3" y1="8" x2="13" y2="8" />
                <polyline points="9,4 13,8 9,12" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

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

      {/* Spacer before footer */}
      <div className="h-8" />
    </div>
  );
}
