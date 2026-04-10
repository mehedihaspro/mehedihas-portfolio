import Image from "next/image";
import { Divider } from "@/components/ui/divider";

export function Footer() {
  return (
    <footer className="bg-bg-subtle rounded-[14px] mx-20 mb-12">
      <div className="flex flex-col gap-6 items-center justify-center px-6 py-12">
        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="mehedihas"
          width={59}
          height={48}
          className="h-12 w-auto"
        />

        {/* Let's Talk + Email */}
        <div className="flex flex-col gap-2 items-center text-center text-[#36322d] font-display font-bold leading-[44px]">
          <p className="text-[36px] tracking-[-2.88px]">
            Let&apos;s talk
          </p>
          <a
            href="mailto:hellomehedihas@gmail.com"
            className="text-[48px] tracking-[-3.84px] hover:text-amber transition-colors"
          >
            hellomehedihas@gmail.com
          </a>
        </div>

        {/* Decorative divider */}
        <Divider variant="decorative" />

        {/* Credits */}
        <div className="flex flex-col gap-1 items-center text-[14px] font-normal text-text-secondary uppercase leading-[20px] font-inter">
          <p>&copy; 2026 mehedihas. All rights reserved.</p>
          <p>design and developed by me</p>
        </div>
      </div>
    </footer>
  );
}
