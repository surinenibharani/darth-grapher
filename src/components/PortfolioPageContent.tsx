import ElfsightInstagramFeed from "@/components/ElfsightInstagramFeed";
import PortfolioGallery from "@/components/PortfolioGallery";
import FadeIn from "@/components/FadeIn";
import { getPhotos, isUsingInstagramFeed } from "@/lib/photos";

const elfsightWidgetId = process.env.NEXT_PUBLIC_ELFSIGHT_WIDGET_ID;

interface PortfolioPageContentProps {
  initialPhotoId?: string;
}

export default async function PortfolioPageContent({
  initialPhotoId,
}: PortfolioPageContentProps) {
  const [photos, usingInstagram] = await Promise.all([
    getPhotos(),
    isUsingInstagramFeed(),
  ]);

  const usingElfsight = Boolean(elfsightWidgetId);

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
            {usingElfsight
              ? "Live Instagram feed from @darthgrapher, powered by Elfsight."
              : usingInstagram
                ? "Photos loaded from @darthgrapher via the Instagram Graph API."
                : "Showing local fallback photos. Connect Elfsight or Instagram Graph API to load your feed."}
          </p>
        </FadeIn>

        <div className="mt-16">
          {usingElfsight ? (
            <ElfsightInstagramFeed widgetId={elfsightWidgetId!} />
          ) : (
            <PortfolioGallery
              photos={photos}
              initialPhotoId={initialPhotoId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
