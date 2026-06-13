import Image from "next/image";
import Link from "next/link";
import {
  speciesLabels,
  getPhotosBySpecies,
  type Species,
} from "@/data/photos";
import FadeIn from "@/components/FadeIn";

const speciesOrder: Species[] = ["birds", "mammals", "marine", "reptiles"];

export const metadata = {
  title: "Collections | Darth Grapher",
  description: "Wildlife photography organized by species collections.",
};

export default function CollectionsPage() {
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
            each frame.
          </p>
        </FadeIn>

        <div className="mt-20 space-y-32">
          {speciesOrder
            .map((species) => ({
              species,
              collection: getPhotosBySpecies(species),
            }))
            .filter(({ collection }) => collection.length > 0)
            .map(({ species, collection }, sectionIndex) => {
            const { label, description } = speciesLabels[species];
            const cover = collection[0];

            return (
              <FadeIn key={species} delay={sectionIndex * 0.1}>
                <section id={species}>
                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={cover.src}
                        alt={cover.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
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
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    {collection.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square overflow-hidden"
                      >
                        <Image
                          src={photo.src}
                          alt={photo.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-void/80 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <p className="font-sans text-[10px] uppercase tracking-widest text-ivory">
                            {photo.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            );
          })}
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
