export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <p className="text-sm font-medium text-amber uppercase tracking-wider mb-4">
          Product Designer &middot; Author &middot; Mentor
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight max-w-2xl">
          Designing experiences that make people think & feel.
        </h1>
        <p className="mt-6 text-lg text-text-secondary max-w-xl leading-relaxed">
          {/* Content will come from Sanity CMS */}
        </p>
      </section>

      {/* Featured Work */}
      <section className="py-16 border-t border-border">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-8">
          Featured Work
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Project cards will be populated from Sanity */}
          <div className="aspect-[4/3] rounded-xl bg-bg-subtle border border-border" />
          <div className="aspect-[4/3] rounded-xl bg-bg-subtle border border-border" />
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 border-t border-border">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-8">
          Latest Writing
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Blog cards will be populated from Sanity */}
          <div className="h-64 rounded-xl bg-bg-subtle border border-border" />
          <div className="h-64 rounded-xl bg-bg-subtle border border-border" />
          <div className="h-64 rounded-xl bg-bg-subtle border border-border" />
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 border-t border-border text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Subscribe to the newsletter
        </h2>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          {/* Newsletter description */}
        </p>
        <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
          <div className="flex-1 h-11 rounded-lg bg-bg-subtle border border-border" />
          <div className="h-11 w-28 rounded-lg bg-amber" />
        </div>
      </section>
    </div>
  );
}
