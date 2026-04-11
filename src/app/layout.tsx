import type { Metadata } from "next";
import { Inter, Hind_Siliguri, Amatic_SC, Caveat } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amaticaSC = Amatic_SC({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mehedihas.pro"),
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
  openGraph: {
    type: "website",
    siteName: "mehedihas",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hindSiliguri.variable} ${amaticaSC.variable} ${caveat.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
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
      <body className="min-h-full flex flex-col font-inter antialiased bg-bg text-text-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
