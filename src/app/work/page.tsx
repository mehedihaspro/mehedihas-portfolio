import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies in product design.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20">
      <section className="py-16">
        <p className="text-sm font-medium text-amber uppercase tracking-wider mb-4">
          Portfolio
        </p>
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Work
        </h1>
        <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
          {/* Description from Sanity */}
        </p>
      </section>

      {/* Project Grid */}
      <section className="grid md:grid-cols-2 gap-6 pb-16">
        {/* Project cards will be populated from Sanity */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-xl bg-bg-subtle border border-border"
          />
        ))}
      </section>
    </div>
  );
}
