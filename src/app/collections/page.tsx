import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import { speciesLabels, type Photo, type Species } from "@/data/photos";
import { groupBirdPhotos } from "@/lib/bird-groups";
import { getPhotosBySpecies } from "@/lib/photos";
import FadeIn from "@/components/FadeIn";
import CollectionsPhotoGrid from "@/components/CollectionsPhotoGrid";

const speciesOrder: Species[] = ["birds", "mammals", "marine", "reptiles"];

export const metadata = {
  title: "Collections | Darth Grapher",
  description: "Wildlife photography organized by species collections.",
};

export const revalidate = 3600;

function SpeciesSection({
  species,
  collection,
  sectionIndex,
}: {
  species: Species;
  collection: Photo[];
  sectionIndex: number;
}) {
  const { label, description } = speciesLabels[species];
  const cover = collection[0];
  const birdGroups =
    species === "birds" ? groupBirdPhotos(collection) : null;

  return (
    <FadeIn delay={sectionIndex * 0.1}>
      <section id={species}>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden">
            <OptimizedImage
              src={cover.src}
              alt={cover.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="pointer-events-none object-cover select-none"
              draggable={false}
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
              Collection {String(sectionIndex + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 font-display text-4xl font-light text-ivory md:text-5xl">
              {label}
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-mist">
              {description}
            </p>
            <p className="mt-2 font-sans text-xs text-mist/60">
              {collection.length} photographs
              {birdGroups && birdGroups.length > 1
                ? ` · ${birdGroups.length} species`
                : ""}
            </p>
          </div>
        </div>

        {birdGroups ? (
          <div className="mt-16 space-y-20">
            {birdGroups.map(({ group, photos }, groupIndex) => (
              <div key={group}>
                <div className="mb-8 flex items-baseline justify-between border-b border-white/5 pb-4">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/70">
                      {String(groupIndex + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-light text-ivory md:text-3xl">
                      {group}
                    </h3>
                  </div>
                  <p className="font-sans text-xs text-mist/50">
                    {photos.length} photo{photos.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <CollectionsPhotoGrid photos={photos} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <CollectionsPhotoGrid photos={collection} />
          </div>
        )}
      </section>
    </FadeIn>
  );
}

export default async function CollectionsPage() {
  const collections = await Promise.all(
    speciesOrder.map(async (species) => ({
      species,
      collection: await getPhotosBySpecies(species),
    }))
  );

  const activeCollections = collections.filter(
    ({ collection }) => collection.length > 0
  );

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <FadeIn>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
            Species Collections
          </p>
          <h1 className="mt-4 font-display text-5xl font-light text-ivory md:text-6xl">
            By Kingdom
          </h1>
          <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-mist">
            Explore curated galleries organized by the creatures that inhabit
            each frame. Birds are grouped by species from Instagram hashtags.
          </p>
        </FadeIn>

        <div className="mt-20 space-y-32">
          {activeCollections.map(({ species, collection }, sectionIndex) => (
            <SpeciesSection
              key={species}
              species={species}
              collection={collection}
              sectionIndex={sectionIndex}
            />
          ))}
        </div>

        <FadeIn className="mt-32 text-center">
          <Link
            href="/portfolio"
            className="border border-white/10 px-10 py-4 font-sans text-xs uppercase tracking-widest text-ivory transition-all hover:border-gold hover:text-gold"
          >
            View Full Portfolio
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
