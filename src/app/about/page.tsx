import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Product Designer, Author, Content Creator & Mentor.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-20">
      <section className="py-16">
        <p className="text-sm font-medium text-amber uppercase tracking-wider mb-4">
          About
        </p>
        <h1 className="text-4xl font-bold text-text-primary mb-6">
          Hey, I&apos;m Mehedi
        </h1>

        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-bg-subtle border border-border mb-8" />

        {/* Bio */}
        <div className="space-y-4 text-lg text-text-secondary leading-relaxed max-w-[680px]">
          <div className="h-4 rounded bg-bg-subtle w-full" />
          <div className="h-4 rounded bg-bg-subtle w-5/6" />
          <div className="h-4 rounded bg-bg-subtle w-4/5" />
        </div>
      </section>

      {/* Skills / What I Do */}
      <section className="py-12 border-t border-border">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-6">
          What I Do
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {["Product Design", "Content Creation", "Mentoring", "Writing"].map(
            (skill) => (
              <div
                key={skill}
                className="p-5 rounded-xl bg-bg-card border border-border"
              >
                <h3 className="font-semibold text-text-primary">{skill}</h3>
              </div>
            )
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 border-t border-border">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-6">
          Journey
        </h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-amber mt-2 shrink-0" />
              <div>
                <div className="h-4 rounded bg-bg-subtle w-48 mb-2" />
                <div className="h-3 rounded bg-bg-subtle w-64" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
