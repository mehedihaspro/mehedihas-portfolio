import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies in product design.",
};

const PROJECTS = [
  {
    slug: "fintech-redesign",
    title: "Fintech App Redesign",
    description:
      "End-to-end product design for a mobile banking experience serving 500K+ users. Redesigned the core flows to improve task completion by 40%.",
    role: "Lead Designer",
    client: "FinBank",
    year: "2026",
    tags: ["Mobile", "Fintech", "UX Research"],
    coverColor: "bg-[#1E2A3A]",
  },
  {
    slug: "healthcare-dashboard",
    title: "Healthcare Dashboard",
    description:
      "Data visualization system for patient management. Designed complex data into clear, actionable insights for medical professionals.",
    role: "Product Designer",
    client: "MedCare",
    year: "2025",
    tags: ["Dashboard", "Data Viz", "Healthcare"],
    coverColor: "bg-[#2D5F2D]",
  },
  {
    slug: "ecommerce-design-system",
    title: "E-commerce Design System",
    description:
      "Built a scalable design system from scratch with 80+ components, serving 12 product teams across web and mobile platforms.",
    role: "Design System Lead",
    client: "ShopFlow",
    year: "2025",
    tags: ["Design System", "Components", "Documentation"],
    coverColor: "bg-[#6B4A4A]",
  },
  {
    slug: "education-platform",
    title: "Education Platform",
    description:
      "Designed an interactive learning platform with gamification elements, course management, and real-time collaboration features.",
    role: "Product Designer",
    client: "LearnHub",
    year: "2024",
    tags: ["EdTech", "Gamification", "Web App"],
    coverColor: "bg-[#4A3F6B]",
  },
];

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20">
      <section className="pt-8 pb-12">
        <p className="text-[11px] font-semibold text-amber uppercase tracking-[0.14em] mb-3">
          Portfolio
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-[1.1] tracking-tight mb-4">
          Selected Work
        </h1>
        <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
          Case studies and projects in product design, design systems, and
          user experience.
        </p>
      </section>

      {/* Project Grid */}
      <section className="space-y-8 pb-16">
        {PROJECTS.map((project, index) => (
          <Link
            key={project.slug}
            href={`/work`}
            className="group block"
          >
            <article
              className={`grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-bg-card border border-border hover:shadow-lg transition-all duration-300 ${
                index % 2 === 1 ? "md:grid-flow-dense" : ""
              }`}
            >
              {/* Cover */}
              <div
                className={`aspect-[16/10] md:aspect-auto ${project.coverColor} relative min-h-[280px] ${
                  index % 2 === 1 ? "md:col-start-2" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">
                    {project.role}
                  </span>
                  <span className="text-text-muted text-[11px]">&middot;</span>
                  <span className="text-[11px] text-text-muted">
                    {project.client}
                  </span>
                  <span className="text-text-muted text-[11px]">&middot;</span>
                  <span className="text-[11px] text-text-muted">
                    {project.year}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 group-hover:text-amber transition-colors">
                  {project.title}
                </h2>

                <p className="text-base text-text-secondary leading-relaxed mb-5">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-bg-subtle text-[11px] font-medium text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="py-12 border-t border-border text-center">
        <p className="text-text-secondary mb-4">
          Interested in working together?
        </p>
        <Link
          href="/contact"
          className="h-10 px-6 inline-flex items-center justify-center rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber-dark transition-colors"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
