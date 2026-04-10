import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { allProjectsQuery } from "@/lib/sanity/queries";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies in product design.",
};

export const revalidate = 60;

export default async function WorkPage() {
  let projects: Array<{
    slug: string;
    title: string;
    description: string;
    role: string;
    client: string;
    year: string;
    tags: string[];
    coverColor: string;
  }> = [];

  try {
    const sanityProjects = await sanityClient.fetch(allProjectsQuery);
    if (sanityProjects?.length) {
      projects = sanityProjects.map((p: {
        slug: { current: string };
        title: string;
        overview: string;
        role: string;
        client: string;
        year: string;
        tags: string[];
        coverColor: string;
      }) => ({
        slug: p.slug.current,
        title: p.title,
        description: p.overview || "",
        role: p.role || "Designer",
        client: p.client || "",
        year: p.year || "",
        tags: p.tags || [],
        coverColor: p.coverColor ? `bg-[${p.coverColor}]` : "bg-bg-subtle",
      }));
    }
  } catch {
    // Sanity fetch failed
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-20 pb-12">
      <PageHeader title="Selected Work" breadcrumbLabel="Work" />

      <section className="px-6 pb-8">
        <p className="text-[16px] text-text-secondary max-w-xl leading-relaxed font-inter">
          Case studies and projects in product design, design systems, and
          user experience.
        </p>
      </section>

      {projects.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-subtle border border-border flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-muted">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No projects yet</h3>
          <p className="text-sm text-text-secondary max-w-sm mx-auto">
            Projects will appear here once published in{" "}
            <Link href="/studio" className="text-amber hover:text-amber-dark font-medium">Sanity Studio</Link>.
          </p>
        </div>
      ) : (
        <section className="space-y-8 pb-16">
          {projects.map((project, index) => (
            <Link key={project.slug} href={`/work/${project.slug}`} className="group block">
              <article
                className={`grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-bg-card border border-border hover:shadow-lg transition-all duration-300 ${
                  index % 2 === 1 ? "md:grid-flow-dense" : ""
                }`}
              >
                <div
                  className={`aspect-[16/10] md:aspect-auto ${project.coverColor} relative min-h-[280px] ${
                    index % 2 === 1 ? "md:col-start-2" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">{project.role}</span>
                    {project.client && (
                      <>
                        <span className="text-text-muted text-[11px]">&middot;</span>
                        <span className="text-[11px] text-text-muted">{project.client}</span>
                      </>
                    )}
                    {project.year && (
                      <>
                        <span className="text-text-muted text-[11px]">&middot;</span>
                        <span className="text-[11px] text-text-muted">{project.year}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 group-hover:text-amber transition-colors">
                    {project.title}
                  </h2>

                  <p className="text-base text-text-secondary leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-bg-subtle text-[11px] font-medium text-text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}

      <section className="py-12 border-t border-border text-center">
        <p className="text-text-secondary mb-4">Interested in working together?</p>
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
