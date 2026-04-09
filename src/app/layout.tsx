import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-body",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "mehedihas — Product Designer, Author & Mentor",
    template: "%s | mehedihas",
  },
  description:
    "Product Designer, Author, Content Creator & Mentor. Exploring design thinking, creativity, and human-centered experiences.",
  keywords: [
    "product designer",
    "UX designer",
    "design mentor",
    "content creator",
    "author",
    "design blog",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('mehedihas-theme');
                if (theme && ['light','sepia','dark','night'].includes(theme)) {
                  document.documentElement.setAttribute('data-theme', theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body antialiased bg-bg text-text-primary">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pt-14">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
