import PortfolioPageContent from "@/components/PortfolioPageContent";

export const metadata = {
  title: "Portfolio | Darth Grapher",
  description: "Browse the full wildlife photography portfolio.",
};

export const revalidate = 3600;

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
