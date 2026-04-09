import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to design insights, thoughts, and updates.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-20">
      <section className="py-16 text-center">
        <p className="text-sm font-medium text-amber uppercase tracking-wider mb-4">
          Newsletter
        </p>
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Stay in the loop
        </h1>
        <p className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed mb-8">
          {/* Newsletter description */}
        </p>

        {/* Subscribe Form — will connect to Kit */}
        <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
          <div className="flex-1 h-11 rounded-lg bg-bg-subtle border border-border" />
          <div className="h-11 w-28 rounded-lg bg-amber" />
        </div>
      </section>

      {/* Past Issues */}
      <section className="py-12 border-t border-border">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-8">
          Past Issues
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-bg-card border border-border flex items-center justify-between"
            >
              <div>
                <div className="h-4 rounded bg-bg-subtle w-48 mb-2" />
                <div className="h-3 rounded bg-bg-subtle w-24" />
              </div>
              <div className="h-3 rounded bg-bg-subtle w-16" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
