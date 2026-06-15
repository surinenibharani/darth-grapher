import type { Metadata } from "next";
import PortfolioPageContent from "@/components/PortfolioPageContent";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description:
    "Browse the full wildlife photography archive — birds, raptors, and intimate moments from the wild.",
  path: "/portfolio",
});

export const revalidate = 3600;

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
