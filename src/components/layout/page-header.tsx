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
    <section className="px-4 md:px-6 pt-2 md:pt-4 pb-5 md:pb-6">
      {/* Breadcrumb */}
      <p className="text-[13px] md:text-[16px] font-normal text-text-primary leading-[22px] font-inter mb-4 md:mb-6">
        <Link href="/" className="hover:text-amber transition-colors">
          Home
        </Link>
        <span> - </span>
        <span className="text-amber">{label}</span>
      </p>

      {/* Page title — Amatic SC Bold, responsive */}
      <h1 className="font-display font-bold text-[clamp(52px,9vw,128px)] leading-[0.88] tracking-[-0.06em] text-[#36322d] mb-5 md:mb-6">
        {title}
      </h1>

      {showDivider && <Divider variant="solid" />}
    </section>
  );
}
