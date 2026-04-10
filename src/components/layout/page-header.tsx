import Link from "next/link";
import { Divider } from "@/components/ui/divider";

interface PageHeaderProps {
  title: string;
  breadcrumbLabel?: string;
  showDivider?: boolean;
}

export function PageHeader({
  title,
  breadcrumbLabel,
  showDivider = true,
}: PageHeaderProps) {
  const label = breadcrumbLabel || title;

  return (
    <section className="rounded-[14px] px-6 pt-6 pb-8">
      {/* Breadcrumb */}
      <div className="flex flex-col mb-6">
        <p className="text-[16px] font-normal text-text-primary leading-[24px] font-inter mb-1">
          <Link href="/" className="hover:text-amber transition-colors">
            Home
          </Link>
          <span> - </span>
          <span className="text-amber">{label}</span>
        </p>

        {/* Page title — Amatic SC Bold 128px */}
        <h1 className="font-display font-bold text-[clamp(64px,10vw,128px)] leading-[0.9] tracking-[-0.08em] text-[#36322d]">
          {title}
        </h1>
      </div>

      {showDivider && <Divider variant="solid" />}
    </section>
  );
}
