import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Quote } from "lucide-react";
import { sanityClient } from "@/lib/sanity/client";
import { projectBySlugQuery } from "@/lib/sanity/queries";
import { PortableText } from "@portabletext/react";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await sanityClient.fetch(projectBySlugQuery, { slug });
    if (project) {
      return { title: project.title, description: project.overview || "" };
    }
  } catch { /* fall through */ }
  return { title: "Project not found" };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;

  let project;
  try {
    project = await sanityClient.fetch(projectBySlugQuery, { slug });
  } catch { /* fetch failed */ }

  if (!project) notFound();

  const coverColor: string = project.coverColor || "";

  return (
    <div className="mx-auto max-w-[820px] px-6 py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[12px] text-text-muted">
        <Link href="/work" className="hover:text-text-primary transition-colors">Work</Link>
        <span>/</span>
        <span className="text-amber truncate">{project.title}</span>
      </nav>

      {/* ========== TITLE ========== */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-[42px] font-bold text-text-primary leading-[1.15] tracking-tight mb-5">
          {project.title}
        </h1>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-amber hover:text-amber-dark font-medium transition-colors"
          >
            View live project <ExternalLink size={14} />
          </a>
        )}
      </header>

      {/* ========== THUMBNAIL / COVER ========== */}
      <div
        className="w-full aspect-[2.2/1] rounded-2xl bg-bg-subtle mb-10"
        style={coverColor ? { backgroundColor: coverColor } : undefined}
      />

      {/* ========== OVERVIEW ========== */}
      {project.overview && (
        <section className="mb-10 max-w-[680px]">
          <p className="text-lg text-text-secondary leading-relaxed">{project.overview}</p>

          <div className="mt-5 space-y-1.5">
            {project.role && (
              <p className="text-[14px] text-text-secondary">
                <span className="font-semibold text-text-primary">Role:</span> {project.role}
              </p>
            )}
            {project.team && (
              <p className="text-[14px] text-text-secondary">
                <span className="font-semibold text-text-primary">Team:</span> {project.team}
              </p>
            )}
            {project.outcomeStatus && (
              <p className="text-[14px] text-text-secondary">
                <span className="font-semibold text-text-primary">Outcome:</span> {project.outcomeStatus}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ========== CONTRIBUTION (callout) ========== */}
      {project.contribution && (
        <section className="mb-10">
          <div className="rounded-xl bg-highlight-bg border-l-4 border-amber px-5 py-4 flex gap-3">
            <Quote size={18} className="text-amber shrink-0 mt-0.5" />
            <p className="text-[15px] text-text-primary leading-relaxed font-medium italic">
              {project.contribution}
            </p>
          </div>
        </section>
      )}

      {/* Tags */}
      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1.5 rounded-lg bg-bg-subtle text-[12px] font-medium text-text-muted">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ========== PROBLEM SPACE IMAGES ========== */}
      {project.problemImages?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-4">
            Problem Space
          </h2>
          <div className="grid gap-4">
            {project.problemImages.map((img: { _key: string; caption?: string }, i: number) => (
              <div key={img._key || i} className="aspect-video rounded-xl bg-bg-subtle border border-border">
                {img.caption && (
                  <p className="text-[12px] text-text-muted mt-2 text-center">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========== RESEARCH ========== */}
      {project.research?.length > 0 && (
        <section className="mb-10 max-w-[680px]">
          <h2 className="text-[22px] font-bold text-text-primary mb-4">Research</h2>
          <div className="text-[16px] text-text-secondary leading-[1.8] prose-bullets">
            <PortableText value={project.research} />
          </div>
        </section>
      )}

      {/* ========== PLANNING ========== */}
      {project.planning?.length > 0 && (
        <section className="mb-10 max-w-[680px]">
          <h2 className="text-[22px] font-bold text-text-primary mb-4">Planning</h2>
          <div className="text-[16px] text-text-secondary leading-[1.8]">
            <PortableText value={project.planning} />
          </div>
        </section>
      )}

      {/* ========== SOLUTION SPACE IMAGES ========== */}
      {project.solutionImages?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-4">
            Solution Space
          </h2>
          <div className="grid gap-4">
            {project.solutionImages.map((img: { _key: string; caption?: string }, i: number) => (
              <div key={img._key || i} className="aspect-video rounded-xl bg-bg-subtle border border-border">
                {img.caption && (
                  <p className="text-[12px] text-text-muted mt-2 text-center">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========== SOLUTIONS (Design Decisions) ========== */}
      {project.solutions?.length > 0 && (
        <section className="mb-10 max-w-[680px]">
          <h2 className="text-[22px] font-bold text-text-primary mb-5">Solutions</h2>
          <div className="space-y-5">
            {project.solutions.map((sol: { _key: string; label: string; description: string }) => (
              <div key={sol._key} className="pl-4 border-l-2 border-amber">
                <h3 className="text-[16px] font-bold text-text-primary mb-1">{sol.label}</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">{sol.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========== CHALLENGES ========== */}
      {project.challenges?.length > 0 && (
        <section className="mb-10 max-w-[680px]">
          <h2 className="text-[22px] font-bold text-text-primary mb-5">Challenges</h2>
          <div className="space-y-4">
            {project.challenges.map((ch: { _key: string; name: string; description: string }) => (
              <div key={ch._key}>
                <h3 className="text-[15px] font-bold text-text-primary">{ch.name}</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">{ch.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========== DETAILED OUTCOME ========== */}
      {project.detailedOutcome?.length > 0 && (
        <section className="mb-10 max-w-[680px]">
          <h2 className="text-[22px] font-bold text-text-primary mb-4">Outcome</h2>
          <div className="text-[16px] text-text-secondary leading-[1.8]">
            <PortableText value={project.detailedOutcome} />
          </div>
        </section>
      )}

      {/* ========== LEARNING ========== */}
      {project.learning && (
        <section className="mb-10 max-w-[680px]">
          <h2 className="text-[22px] font-bold text-text-primary mb-4">Learning</h2>
          <p className="text-[16px] text-text-secondary leading-[1.8]">{project.learning}</p>
        </section>
      )}

      {/* ========== WHAT'S NEXT ========== */}
      {project.whatsNext && (
        <section className="mb-10 max-w-[680px]">
          <h2 className="text-[22px] font-bold text-text-primary mb-4">What&apos;s Next</h2>
          <p className="text-[16px] text-text-secondary leading-[1.8]">{project.whatsNext}</p>
        </section>
      )}

      {/* Back */}
      <div className="mt-16 pt-8 border-t border-border">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-amber transition-colors"
        >
          <ArrowLeft size={16} />
          Back to all projects
        </Link>
      </div>
    </div>
  );
}
