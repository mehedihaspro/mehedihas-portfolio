import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import {
  CurrentlySection,
  WhatIDoSection,
  JourneySection,
  MemoriesSection,
  SectionLabel,
} from "@/components/about";

export const metadata: Metadata = {
  title: "About",
  description: "Product Designer, Author, Content Creator & Mentor.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-20 pb-12">
      <PageHeader title="Hey, I'm Mehedi" breadcrumbLabel="About" />

      {/* Hero paragraph — Inter Light 48px/62px */}
      <section className="px-6 py-12 flex justify-center">
        <div className="w-full max-w-[720px]">
          <p className="font-inter font-light text-[clamp(28px,3.5vw,48px)] leading-[1.3] tracking-[-0.5px] text-text-primary">
            I&apos;m a product designer who believes great design is invisible
            — it just works. I spend my days crafting digital experiences and
            my evenings writing about the psychology behind why we interact
            with products the way we do.
          </p>
        </div>
      </section>

      {/* Smaller bio paragraphs */}
      <section className="px-6 pb-12 flex justify-center">
        <div className="w-full max-w-[720px] space-y-6">
          <p className="font-inter font-light text-[16px] leading-[24px] tracking-[-0.5px] text-text-primary">
            Beyond design, I&apos;m an author, content creator, and mentor. I
            write in Bangla and English, exploring design thinking, creativity,
            and what makes products truly resonate with people.
          </p>
          <p className="font-inter font-light text-[16px] leading-[24px] tracking-[-0.5px] text-text-primary">
            When I&apos;m not designing or writing, you&apos;ll find me
            mentoring aspiring designers, running workshops, or diving deep
            into behavioral psychology research.
          </p>
        </div>
      </section>

      {/* CURRENTLY section */}
      <section className="px-6 pt-12 pb-16">
        <SectionLabel label="Currently" />
        <div className="pt-12">
          <CurrentlySection />
        </div>
      </section>

      {/* WHAT I DO section */}
      <section className="px-6 pt-12 pb-16">
        <SectionLabel label="What I Do" />
        <div className="pt-4">
          <WhatIDoSection />
        </div>
      </section>

      {/* JOURNEY section */}
      <section className="px-6 pt-12 pb-16">
        <SectionLabel label="Journey" />
        <div className="pt-12 flex justify-center">
          <JourneySection />
        </div>
      </section>

      {/* MEMORIES section */}
      <section className="px-6 pt-12 pb-16">
        <SectionLabel label="Memories" />
        <div className="pt-8">
          <MemoriesSection />
        </div>
      </section>
    </div>
  );
}
