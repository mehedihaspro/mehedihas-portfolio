import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { sanityClient } from "@/lib/sanity/client";
import { projectBySlugQuery } from "@/lib/sanity/queries";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

function extractSectionsFromBody(body: Array<{ _type: string; style?: string; _key: string; children?: Array<{ text: string }> }>) {
  if (!body) return [];

  const sections: Array<{ id: string; heading: string; content: string }> = [];
  let currentSection: { id: string; heading: string; paragraphs: string[] } | null = null;

  for (const block of body) {
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      if (currentSection) {
        sections.push({
          id: currentSection.id,
          heading: currentSection.heading,
          content: currentSection.paragraphs.join("\n\n"),
        });
      }
      const text = block.children?.map((c) => c.text).join("") || "";
      currentSection = { id: block._key, heading: text, paragraphs: [] };
    } else if (block._type === "block" && currentSection) {
      const text = block.children?.map((c) => c.text).join("") || "";
      if (text.trim()) currentSection.paragraphs.push(text);
    } else if (block._type === "block" && !currentSection) {
      const text = block.children?.map((c) => c.text).join("") || "";
      if (text.trim()) {
        currentSection = { id: "overview", heading: "Overview", paragraphs: [text] };
      }
    }
  }

  if (currentSection) {
    sections.push({
      id: currentSection.id,
      heading: currentSection.heading,
      content: currentSection.paragraphs.join("\n\n"),
    });
  }

  return sections;
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await sanityClient.fetch(projectBySlugQuery, { slug });
    if (project) {
      return {
        title: project.title,
        description: project.description || "",
      };
    }
  } catch {
    // Fall through
  }

  return { title: "Project not found" };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;

  let project;
  try {
    project = await sanityClient.fetch(projectBySlugQuery, { slug });
  } catch {
    // Fetch failed
  }

  if (!project) {
    notFound();
  }

  const sections = extractSectionsFromBody(project.body);
  const coverColor = project.coverColor ? `bg-[${project.coverColor}]` : "bg-bg-subtle";

  return (
    <div className="mx-auto max-w-[820px] px-6 py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[12px] text-text-muted">
        <Link href="/work" className="hover:text-text-primary transition-colors">
          Work
        </Link>
        <span>/</span>
        <span className="text-amber">{project.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {project.role && (
            <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">
              {project.role}
            </span>
          )}
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

        <h1 className="text-3xl md:text-[42px] font-bold text-text-primary leading-[1.15] tracking-tight mb-4">
          {project.title}
        </h1>

        {project.description && (
          <p className="text-lg text-text-secondary leading-relaxed max-w-[680px]">
            {project.description}
          </p>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-amber hover:text-amber-dark font-medium transition-colors"
          >
            View live project <ExternalLink size={14} />
          </a>
        )}
      </header>

      {/* Cover */}
      <div className={`w-full aspect-[2.2/1] rounded-2xl ${coverColor} mb-10`} />

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

      {/* Case Study Body */}
      {sections.length > 0 && (
        <article className="max-w-[680px]">
          <div className="text-[18px] leading-[1.8] text-text-primary">
            {sections.map((section) => (
              <section key={section.id} className="mb-10">
                <h2 id={section.id} className="text-[27px] font-bold text-text-primary leading-tight mb-4 scroll-mt-20">
                  {section.heading}
                </h2>
                {section.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 text-text-secondary leading-[inherit]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
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
