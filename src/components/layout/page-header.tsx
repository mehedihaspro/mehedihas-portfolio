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
    <section className="px-6 pt-0 pb-5">
      {/* Breadcrumb */}
      <div className="flex flex-col mb-4">
        <p className="text-[14px] md:text-[16px] font-normal text-text-primary leading-[22px] font-inter mb-0.5">
          <Link href="/" className="hover:text-amber transition-colors">
            Home
          </Link>
          <span> - </span>
          <span className="text-amber">{label}</span>
        </p>

        {/* Page title — Amatic SC Bold, responsive */}
        <h1 className="font-display font-bold text-[clamp(56px,9vw,128px)] leading-[0.88] tracking-[-0.06em] text-[#36322d] -mt-2">
          {title}
        </h1>
      </div>

      {showDivider && <Divider variant="solid" />}
    </section>
  );
}
