"use client";

import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Photo } from "@/data/photos";
import FadeIn from "@/components/FadeIn";
import { photoPortfolioPath } from "@/lib/photo-url";

interface HomePageClientProps {
  selectedMoments: Photo[];
  heroPhoto: Photo | null;
  usingInstagram: boolean;
}

export default function HomePageClient({
  selectedMoments,
  heroPhoto,
  usingInstagram,
}: HomePageClientProps) {
  const router = useRouter();

  if (!heroPhoto && selectedMoments.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-32">
        <p className="max-w-lg text-center font-sans text-sm text-mist">
          No photos available yet. Connect the Instagram Graph API to load your
          portfolio automatically.
        </p>
      </div>
    );
  }

  const hero = heroPhoto ?? selectedMoments[0];
  const moments = selectedMoments
    .filter((photo) => photo.id !== hero?.id)
    .slice(0, 9);

  return (
    <>
      <section className="relative flex h-screen items-end overflow-hidden bg-void">
        <motion.div
          key={hero.id}
          initial={{ scale: 1 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 20, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={hero.src}
            alt={hero.title}
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-contain select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-sans text-xs uppercase tracking-[0.3em] text-gold"
          >
            Wildlife Photography
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-4 max-w-3xl font-display text-5xl font-light leading-tight text-ivory md:text-7xl lg:text-8xl"
          >
            Where the Wild
            <br />
            <span className="italic text-gold">Comes Alive</span>
          </motion.h1>
          {usingInstagram && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-4 font-sans text-xs uppercase tracking-widest text-mist"
            >
              Live from @darthgrapher on Instagram
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10 flex gap-6"
          >
            <Link
              href="/portfolio"
              className="border border-gold/60 px-8 py-3 font-sans text-xs uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-void"
            >
              View Portfolio
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 font-sans text-xs uppercase tracking-widest text-mist transition-colors hover:text-ivory"
            >
              About
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-sans text-[10px] uppercase tracking-widest text-mist">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-8 w-px bg-mist/50"
            />
          </div>
        </motion.div>
      </section>

      <section className="bg-void py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <FadeIn>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
              Featured Work
            </p>
            <h2 className="mt-4 font-display text-4xl font-light text-ivory md:text-5xl">
              Selected Moments
            </h2>
            <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-mist">
              Intimate frames drawn from the wild.
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moments.map((photo, i) => (
              <FadeIn key={photo.id} delay={i * 0.1}>
                <button
                  type="button"
                  onClick={() => router.push(photoPortfolioPath(photo.id))}
                  className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden"
                >
                  <OptimizedImage
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="pointer-events-none object-cover object-[center_35%] select-none transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-display text-xl text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {photo.title}
                    </p>
                    {photo.birdGroup && (
                      <p className="mt-1 font-sans text-[10px] uppercase tracking-widest text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        {photo.birdGroup}
                      </p>
                    )}
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-charcoal py-32">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <FadeIn>
            <p className="font-display text-3xl font-light italic leading-relaxed text-ivory md:text-4xl">
              &ldquo;Every frame is a quiet conversation between patience and
              wonder.&rdquo;
            </p>
            <p className="mt-8 font-sans text-xs uppercase tracking-widest text-mist">
              Darth Grapher
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <FadeIn className="flex flex-col items-center text-center">
            <h2 className="font-display text-4xl font-light text-ivory md:text-5xl">
              Explore the Collections
            </h2>
            <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-mist">
              Curated galleries organized by species — from soaring raptors to
              creatures of the deep.
            </p>
            <Link
              href="/collections"
              className="mt-10 border border-white/10 px-10 py-4 font-sans text-xs uppercase tracking-widest text-ivory transition-all hover:border-gold hover:text-gold"
            >
              View Collections
            </Link>
          </FadeIn>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
