import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedStatusBanner from "@/components/FeedStatusBanner";
import MediaProtection from "@/components/MediaProtection";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { rootMetadata } from "@/lib/metadata";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="font-sans">
        <GoogleAnalytics />
        <MediaProtection />
        <Navbar />
        <main>
          <FeedStatusBanner />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
