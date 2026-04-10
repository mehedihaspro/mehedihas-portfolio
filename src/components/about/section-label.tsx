import { Divider } from "@/components/ui/divider";

interface SectionLabelProps {
  label: string;
}

export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-[16px] font-normal text-text-primary leading-[24px] uppercase font-inter tracking-wider">
        {label}
      </p>
      <Divider variant="solid" />
    </div>
  );
}
