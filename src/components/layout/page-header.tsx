import { Divider } from "@/components/ui/divider";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";

interface PageHeaderProps {
  title: string;
  breadcrumbLabel?: string;
  breadcrumbItems?: BreadcrumbItem[];
  showDivider?: boolean;
}

export function PageHeader({
  title,
  breadcrumbLabel,
  breadcrumbItems,
  showDivider = true,
}: PageHeaderProps) {
  // If no custom items, build from label
  const items: BreadcrumbItem[] =
    breadcrumbItems || (breadcrumbLabel ? [{ label: breadcrumbLabel }] : []);

  return (
    <section className="px-4 md:px-6 pt-2 md:pt-4 pb-5 md:pb-6">
      {/* Breadcrumb chip */}
      {items.length > 0 && (
        <div className="mb-5 md:mb-6">
          <Breadcrumb items={items} />
        </div>
      )}

      {/* Page title — Amatic SC Bold, responsive */}
      <h1 className="font-display font-bold text-[clamp(52px,9vw,128px)] leading-[0.88] tracking-[-0.06em] text-[#36322d] mb-5 md:mb-6">
        {title}
      </h1>

      {showDivider && <Divider variant="solid" />}
    </section>
  );
}
