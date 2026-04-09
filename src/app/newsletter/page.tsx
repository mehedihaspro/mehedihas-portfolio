import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to design insights, thoughts, and updates.",
};

const PAST_ISSUES = [
  {
    title: "Duolingo এর Gamification কেন এত Effective?",
    date: "Mar 28, 2026",
    number: 12,
  },
  {
    title: "Design System শুরু করার সহজ Guide",
    date: "Mar 14, 2026",
    number: 11,
  },
  {
    title: "Portfolio Review তে আমি যে Mistakes সবচেয়ে বেশি দেখি",
    date: "Feb 28, 2026",
    number: 10,
  },
  {
    title: "Micro-interactions — ছোট Details, বড় Impact",
    date: "Feb 14, 2026",
    number: 9,
  },
  {
    title: "Color Theory — শুধু Theory না, Practical Guide",
    date: "Jan 28, 2026",
    number: 8,
  },
  {
    title: "Design Thinking কি সত্যিই কাজ করে?",
    date: "Jan 14, 2026",
    number: 7,
  },
];

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-20">
      {/* Hero */}
      <section className="pt-8 pb-12 text-center">
        <p className="text-[11px] font-semibold text-amber uppercase tracking-[0.14em] mb-3">
          Newsletter
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-[1.1] tracking-tight mb-4">
          Design insights,
          <br />
          delivered weekly.
        </h1>
        <p className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed mb-8">
          Every week I share thoughts on design psychology, product thinking,
          and creativity — in Bangla and English.
        </p>

        {/* Subscribe Form */}
        <div className="flex items-center justify-center gap-3 max-w-sm mx-auto mb-4">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 h-11 px-4 rounded-xl bg-bg-subtle border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-highlight-bg transition-all"
            readOnly
          />
          <button className="h-11 px-6 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber-dark transition-colors shrink-0">
            Subscribe
          </button>
        </div>
        <p className="text-[12px] text-text-muted">
          Free forever. Unsubscribe anytime. No spam.
        </p>
      </section>

      {/* What to expect */}
      <section className="py-10 border-t border-border">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-6">
          What You&apos;ll Get
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: "Design Analysis",
              description: "Deep dives into why popular products work the way they do",
            },
            {
              title: "Practical Tips",
              description: "Actionable advice you can apply to your design work immediately",
            },
            {
              title: "Career Insights",
              description: "Honest thoughts on growing as a designer in today's industry",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-xl bg-bg-card border border-border"
            >
              <h3 className="text-sm font-bold text-text-primary mb-1">
                {item.title}
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Past Issues */}
      <section className="py-10 border-t border-border">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] mb-6">
          Past Issues
        </h2>
        <div className="space-y-1">
          {PAST_ISSUES.map((issue) => (
            <Link
              key={issue.number}
              href="/newsletter"
              className="group flex items-center justify-between gap-4 py-3.5 px-4 -mx-4 rounded-xl hover:bg-bg-card transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[11px] font-mono text-text-muted shrink-0 w-8">
                  #{issue.number}
                </span>
                <h3 className="text-sm font-medium text-text-primary truncate group-hover:text-amber transition-colors">
                  {issue.title}
                </h3>
              </div>
              <span className="text-[12px] text-text-muted shrink-0">
                {issue.date}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
