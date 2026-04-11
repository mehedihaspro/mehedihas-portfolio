import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bg-card border border-border ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home icon always first */}
      <Link
        href="/"
        className="flex items-center text-text-muted hover:text-amber transition-colors"
        aria-label="Home"
      >
        <Home size={11} strokeWidth={2} />
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            <ChevronRight
              size={11}
              className="text-text-muted/60 shrink-0"
              strokeWidth={2}
            />
            {item.href ? (
              // Items with href always render as links, regardless of position.
              // "You are here" styling (amber) only applies to the label-only
              // last item.
              <Link
                href={item.href}
                aria-current={isLast ? "page" : undefined}
                className="text-[12px] font-medium text-text-secondary hover:text-amber transition-colors font-inter whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={`text-[12px] font-semibold whitespace-nowrap font-inter ${
                  isLast ? "text-amber" : "text-text-secondary"
                }`}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
