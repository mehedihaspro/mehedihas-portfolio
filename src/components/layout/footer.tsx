import Image from "next/image";
import { Divider } from "@/components/ui/divider";

export function Footer() {
  return (
    <footer className="bg-bg-subtle rounded-[14px] mx-4 md:mx-8 lg:mx-20 mb-4 md:mb-8 lg:mb-12 relative z-10">
      <div className="flex flex-col gap-5 md:gap-6 items-center justify-center px-4 md:px-6 py-8 md:py-12">
        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="mehedihas"
          width={59}
          height={48}
          className="h-10 md:h-12 w-auto"
        />

        {/* Let's Talk + Email */}
        <div className="flex flex-col gap-1 md:gap-2 items-center text-center text-ink-display font-display font-bold">
          <p className="text-[28px] md:text-[36px] leading-[32px] md:leading-[44px] tracking-[-1.5px] md:tracking-[-2.88px]">
            Let&apos;s talk
          </p>
          <a
            href="mailto:hellomehedihas@gmail.com"
            className="text-[24px] md:text-[40px] lg:text-[48px] leading-[28px] md:leading-[44px] tracking-[-1.5px] md:tracking-[-3.84px] hover:text-amber transition-colors break-all"
          >
            hellomehedihas@gmail.com
          </a>
        </div>

        {/* Decorative divider */}
        <Divider variant="decorative" />

        {/* Credits */}
        <div className="flex flex-col gap-1 items-center text-center text-[11px] md:text-[14px] font-normal text-text-secondary uppercase leading-[16px] md:leading-[20px] font-inter">
          <p>&copy; 2026 mehedihas. All rights reserved.</p>
          <p>design and developed by me</p>
        </div>
      </div>
    </footer>
  );
}
