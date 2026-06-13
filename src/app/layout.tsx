import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedStatusBanner from "@/components/FeedStatusBanner";
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

export const metadata: Metadata = {
  title: "Darth Grapher | Wildlife Photography",
  description:
    "A premium wildlife photography portfolio showcasing the beauty and power of the natural world.",
  icons: {
    icon: "/images/about-tree-swallow.jpg",
    apple: "/images/about-tree-swallow.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="font-sans">
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
