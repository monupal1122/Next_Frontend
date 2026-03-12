import type { Metadata } from "next";
import { Inter, Outfit, Teko } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { getCategories, getHeadlines } from "@/lib/api";

const inter = Inter({
  variable: "--font-article",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Daily News Views",
    template: "%s | Daily News Views",
  },
  description: "Stay ahead with the latest news, in-depth analysis, and breaking stories from around the world.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8081"),
  icons: {
    icon: "/logo1.webp",
    apple: "/logo1.webp",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch Navbar data on the server to avoid client-side fetch errors/CORS
  const [categories, headlines] = await Promise.all([
    getCategories(),
    getHeadlines(),
  ]);

  return (
    <html lang="en">
      <head>
        {/*
          Google AdSense script — loaded once globally for every page.
          strategy="afterInteractive" defers loading until after hydration
          so it never blocks the page render or LCP.

          Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your real Publisher ID:
            AdSense dashboard → Account → Account info → Publisher ID
          Or set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID in .env.local
        */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-XXXXXXXXXXXXXXXX"}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${outfit.variable} ${inter.variable} ${teko.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar initialCategories={categories} initialHeadlines={headlines} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
