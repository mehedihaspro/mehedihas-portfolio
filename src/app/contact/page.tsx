"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Will connect to API route later
    setTimeout(() => setStatus("sent"), 1000);
  };

  return (
    <div className="mx-auto max-w-[680px] px-6 py-20">
      <section className="pt-8 pb-12">
        <p className="text-[11px] font-semibold text-amber uppercase tracking-[0.14em] mb-3">
          Contact
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-[1.1] tracking-tight mb-4">
          Let&apos;s talk
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          Have a project in mind, want mentorship, or just want to say hello?
          I&apos;d love to hear from you.
        </p>
      </section>

      {/* Quick links */}
      <section className="pb-10">
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Email", value: "hello@mehedihas.pro", href: "mailto:hello@mehedihas.pro" },
            { label: "Twitter", value: "@mehedihas", href: "https://twitter.com/mehedihas" },
            { label: "LinkedIn", value: "mehedihas", href: "https://linkedin.com/in/mehedihas" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="p-4 rounded-xl bg-bg-card border border-border hover:border-amber hover:shadow-sm transition-all group"
            >
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                {link.label}
              </span>
              <span className="text-sm text-text-primary font-medium group-hover:text-amber transition-colors">
                {link.value}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-10 border-t border-border">
        {status === "sent" ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-highlight-bg flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Message sent!
            </h3>
            <p className="text-sm text-text-secondary">
              Thanks for reaching out. I&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full h-11 px-4 rounded-xl bg-bg-card border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-highlight-bg transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="w-full h-11 px-4 rounded-xl bg-bg-card border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-highlight-bg transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                value={formState.subject}
                onChange={(e) =>
                  setFormState({ ...formState, subject: e.target.value })
                }
                placeholder="What's this about?"
                className="w-full h-11 px-4 rounded-xl bg-bg-card border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-highlight-bg transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                placeholder="Tell me more..."
                className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber focus:ring-2 focus:ring-highlight-bg transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full h-11 rounded-xl bg-amber text-white text-sm font-semibold hover:bg-amber-dark transition-colors disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
