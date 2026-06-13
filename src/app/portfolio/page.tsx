import { photos } from "@/data/photos";
import PhotoGrid from "@/components/PhotoGrid";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Portfolio | Darth Grapher",
  description: "Browse the full wildlife photography portfolio.",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <FadeIn>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
            Portfolio
          </p>
          <h1 className="mt-4 font-display text-5xl font-light text-ivory md:text-6xl">
            The Archive
          </h1>
          <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-mist">
            Verified matches from @darthgrapher on Instagram — titles and
            captions pulled directly from each post.
          </p>
        </FadeIn>

        <div className="mt-16">
          <PhotoGrid photos={photos} />
        </div>
      </div>
    </div>
  );
}
