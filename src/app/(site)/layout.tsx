import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeFab } from "@/components/layout/theme-fab";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[1100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-amber focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 pt-14">
        {children}
      </main>
      <Footer />
      <ThemeFab />
    </>
  );
}
