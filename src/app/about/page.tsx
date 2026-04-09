import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Product Designer, Author, Content Creator & Mentor.",
};

const SKILLS = [
  {
    title: "Product Design",
    description:
      "End-to-end product design from research to delivery. Crafting user-centered experiences for web and mobile.",
  },
  {
    title: "Design Systems",
    description:
      "Building scalable, consistent component libraries and design tokens that serve multiple teams and platforms.",
  },
  {
    title: "Content Creation",
    description:
      "Writing about design, psychology, and creativity in Bangla and English. Newsletter, blog, and social media.",
  },
  {
    title: "Mentoring",
    description:
      "Guiding aspiring designers through portfolio reviews, career advice, and 1:1 mentorship sessions.",
  },
];

const TIMELINE = [
  {
    year: "Present",
    title: "Lead Designer & Content Creator",
    description:
      "Leading design teams, writing about design psychology, mentoring designers, and building this portfolio.",
  },
  {
    year: "2024",
    title: "Senior Product Designer",
    description:
      "Designed complex enterprise products. Built and maintained design systems used by 10+ teams.",
  },
  {
    year: "2022",
    title: "Product Designer",
    description:
      "Joined the world of product design. Worked on consumer-facing apps with millions of users.",
  },
  {
    year: "2020",
    title: "Started Design Journey",
    description:
      "Fell in love with design. Self-taught through online courses, practice, and community.",
  },
];

const CURRENTLY = [
  { label: "Designing", value: "Design System v2" },
  { label: "Writing", value: "Newsletter on Design Psychology" },
  { label: "Reading", value: "Refactoring UI by Adam Wathan" },
  { label: "Learning", value: "Motion Design & Animation" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-20">
      {/* Header */}
      <section className="pt-8 pb-12">
        <p className="text-[11px] font-semibold text-amber uppercase tracking-[0.14em] mb-3">
          About
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6">
          Hey, I&apos;m Mehedi
        </h1>

        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-bg-subtle border border-border mb-8" />

        {/* Bio */}
        <div className="space-y-4 text-lg text-text-secondary leading-relaxed max-w-[680px]">
          <p>
            I&apos;m a product designer who believes great design is invisible — it
            just works. I spend my days crafting digital experiences and my
            evenings writing about the psychology behind why we interact with
            products the way we do.
          </p>
          <p>
            Beyond design, I&apos;m an author, content creator, and mentor. I write
            in Bangla and English, exploring design thinking, creativity, and
            what makes products truly resonate with people.
          </p>
          <p>
            When I&apos;m not designing or writing, you&apos;ll find me mentoring
            aspiring designers, running workshops, or diving deep into behavioral
            psychology research.
          </p>
        </div>
      </section>

      {/* Currently */}
      <section className="py-10 border-t border-border">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-6">
          Currently
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CURRENTLY.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 p-4 rounded-xl bg-bg-card border border-border"
            >
              <span className="text-[11px] font-semibold text-amber uppercase tracking-wider shrink-0 mt-0.5">
                {item.label}
              </span>
              <span className="text-sm text-text-primary font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* What I Do */}
      <section className="py-10 border-t border-border">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-6">
          What I Do
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {SKILLS.map((skill) => (
            <div
              key={skill.title}
              className="p-5 rounded-xl bg-bg-card border border-border"
            >
              <h3 className="font-bold text-text-primary mb-2">
                {skill.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="py-10 border-t border-border">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-8">
          Journey
        </h2>
        <div className="space-y-0">
          {TIMELINE.map((item, index) => (
            <div key={item.year} className="flex gap-6">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-amber shrink-0 mt-1.5" />
                {index < TIMELINE.length - 1 && (
                  <div className="w-px flex-1 bg-border" />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">
                  {item.year}
                </span>
                <h3 className="text-base font-bold text-text-primary mt-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 border-t border-border">
        <div className="rounded-2xl bg-bg-card border border-border p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-1">
              Want to work together?
            </h3>
            <p className="text-sm text-text-secondary">
              I&apos;m open to collaborations, mentorship, and interesting
              conversations.
            </p>
          </div>
          <Link
            href="/contact"
            className="h-10 px-6 inline-flex items-center justify-center rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber-dark transition-colors shrink-0"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
