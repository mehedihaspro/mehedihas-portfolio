import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Workshops",
  description: "Design workshops and courses for aspiring designers.",
};

const UPCOMING = [
  {
    title: "Design System Masterclass",
    description:
      "Learn how to build a scalable design system from scratch — tokens, components, documentation, and team adoption.",
    date: "April 20, 2026",
    time: "10:00 AM - 1:00 PM BST",
    price: "Free",
    spots: "30 spots",
    status: "upcoming" as const,
  },
  {
    title: "Portfolio Review Workshop",
    description:
      "Live portfolio reviews with actionable feedback. Learn what hiring managers look for and how to stand out.",
    date: "May 5, 2026",
    time: "7:00 PM - 9:00 PM BST",
    price: "Free",
    spots: "20 spots",
    status: "upcoming" as const,
  },
];

const PAST = [
  {
    title: "Figma Variables Deep Dive",
    description:
      "Hands-on workshop on Figma variables, modes, and theming.",
    date: "Feb 15, 2026",
    attendees: "45 attendees",
  },
  {
    title: "UX Writing for Designers",
    description:
      "How to write clear, effective microcopy that improves user experience.",
    date: "Jan 10, 2026",
    attendees: "32 attendees",
  },
  {
    title: "Getting Your First Design Job",
    description:
      "Career workshop covering portfolio, resume, interviews, and networking.",
    date: "Dec 5, 2025",
    attendees: "60 attendees",
  },
];

export default function WorkshopsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-20 pb-12">
      <PageHeader title="Workshops & Courses" breadcrumbLabel="Workshops" />

      <section className="px-6 pb-8">
        <p className="text-[16px] text-text-secondary max-w-xl leading-relaxed font-inter">
          Practical, hands-on learning for designers at every level. Free
          workshops, live sessions, and community.
        </p>
      </section>

      {/* Upcoming */}
      <section className="pb-12">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-6">
          Upcoming
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {UPCOMING.map((workshop) => (
            <div
              key={workshop.title}
              className="rounded-2xl bg-bg-card border border-border p-6 md:p-8 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full bg-highlight-bg text-[11px] font-semibold text-amber">
                  Upcoming
                </span>
                <span className="text-[11px] text-text-muted">
                  {workshop.price}
                </span>
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-2">
                {workshop.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                {workshop.description}
              </p>

              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-[13px]">
                  <CalendarIcon />
                  <span className="text-text-primary font-medium">
                    {workshop.date}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <ClockIcon />
                  <span className="text-text-secondary">{workshop.time}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <UsersIcon />
                  <span className="text-text-secondary">{workshop.spots}</span>
                </div>
              </div>

              <button className="w-full h-10 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber-dark transition-colors">
                Register (Free)
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Past Workshops */}
      <section className="py-12 border-t border-border">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-6">
          Past Workshops
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PAST.map((workshop) => (
            <div
              key={workshop.title}
              className="p-5 rounded-xl bg-bg-card border border-border"
            >
              <span className="text-[11px] text-text-muted">
                {workshop.date}
              </span>
              <h3 className="text-base font-bold text-text-primary mt-2 mb-1">
                {workshop.title}
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
                {workshop.description}
              </p>
              <span className="text-[11px] text-text-muted">
                {workshop.attendees}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Notify CTA */}
      <section className="py-12 border-t border-border text-center">
        <h3 className="text-xl font-bold text-text-primary mb-2">
          Don&apos;t miss the next one
        </h3>
        <p className="text-sm text-text-secondary mb-5">
          Get in touch to stay updated about upcoming workshops.
        </p>
        <a
          href="mailto:hellomehedihas@gmail.com"
          className="h-10 px-6 inline-flex items-center justify-center rounded-xl bg-text-primary text-bg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Get in touch
        </a>
      </section>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-text-muted shrink-0">
      <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" />
      <line x1="1.5" y1="6" x2="12.5" y2="6" />
      <line x1="4.5" y1="1" x2="4.5" y2="4" />
      <line x1="9.5" y1="1" x2="9.5" y2="4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-text-muted shrink-0">
      <circle cx="7" cy="7" r="5.5" />
      <polyline points="7,4 7,7 9.5,8.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-text-muted shrink-0">
      <circle cx="5" cy="4.5" r="2" />
      <path d="M1.5 12c0-2.2 1.6-4 3.5-4s3.5 1.8 3.5 4" />
      <circle cx="10" cy="4.5" r="1.5" />
      <path d="M10.5 8c1.4 0 2.5 1.3 2.5 3" />
    </svg>
  );
}
