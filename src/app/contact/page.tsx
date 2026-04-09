import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for collaborations, mentorship, or just to say hello.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[680px] px-6 py-20">
      <section className="py-16">
        <p className="text-sm font-medium text-amber uppercase tracking-wider mb-4">
          Contact
        </p>
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Let&apos;s talk
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed mb-10">
          {/* Contact description */}
        </p>

        {/* Contact Form — will use serverless function */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Name
            </label>
            <div className="h-11 rounded-lg bg-bg-card border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <div className="h-11 rounded-lg bg-bg-card border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Subject
            </label>
            <div className="h-11 rounded-lg bg-bg-card border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Message
            </label>
            <div className="h-32 rounded-lg bg-bg-card border border-border" />
          </div>
          <div className="h-11 w-full rounded-lg bg-amber" />
        </form>
      </section>
    </div>
  );
}
