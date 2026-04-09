import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshops",
  description: "Design workshops and courses for aspiring designers.",
};

export default function WorkshopsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20">
      <section className="py-16">
        <p className="text-sm font-medium text-amber uppercase tracking-wider mb-4">
          Learn
        </p>
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Workshops & Courses
        </h1>
        <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
          {/* Workshops description */}
        </p>
      </section>

      {/* Upcoming */}
      <section className="pb-12">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-6">
          Upcoming
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-bg-card border border-border"
            >
              <div className="h-4 rounded bg-bg-subtle w-3/4 mb-3" />
              <div className="h-3 rounded bg-bg-subtle w-1/2 mb-4" />
              <div className="h-3 rounded bg-bg-subtle w-24" />
            </div>
          ))}
        </div>
      </section>

      {/* Past */}
      <section className="py-12 border-t border-border">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-6">
          Past Workshops
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-bg-card border border-border"
            >
              <div className="h-4 rounded bg-bg-subtle w-3/4 mb-3" />
              <div className="h-3 rounded bg-bg-subtle w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
