import Link from "next/link";

const FOOTER_LINKS = {
  Explore: [
    { href: "/work", label: "Work" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ],
  Connect: [
    { href: "/newsletter", label: "Newsletter" },
    { href: "/workshops", label: "Workshops" },
    { href: "/contact", label: "Contact" },
  ],
  Social: [
    { href: "https://twitter.com/mehedihas", label: "Twitter" },
    { href: "https://linkedin.com/in/mehedihas", label: "LinkedIn" },
    { href: "https://dribbble.com/mehedihas", label: "Dribbble" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-lg font-bold text-text-primary tracking-tight"
            >
              mehedihas
            </Link>
            <p className="mt-3 text-sm text-text-muted leading-relaxed max-w-xs">
              Product Designer, Author, Content Creator & Mentor.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} mehedihas. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Designed & built with care
          </p>
        </div>
      </div>
    </footer>
  );
}
