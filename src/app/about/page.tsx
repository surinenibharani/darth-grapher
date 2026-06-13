import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { getPhotos } from "@/lib/photos";

export const metadata = {
  title: "About | Darth Grapher",
  description: "Learn about the photographer behind Darth Grapher.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const photos = await getPhotos();
  const portrait = photos[5] ?? photos[0];
  const collectionCount = new Set(photos.map((photo) => photo.species)).size;

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <FadeIn>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={portrait.src}
                alt="Photographer at work"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          <div className="flex flex-col justify-center">
            <FadeIn delay={0.15}>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
                About
              </p>
              <h1 className="mt-4 font-display text-5xl font-light text-ivory md:text-6xl">
                The Story Behind
                <br />
                the Lens
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} className="mt-10 space-y-6">
              <p className="font-sans text-sm leading-relaxed text-mist">
                Darth Grapher is a wildlife photographer driven by a deep respect
                for the natural world. Every image begins long before the
                shutter clicks — in the pre-dawn hikes, the hours of stillness,
                and the quiet understanding that we are guests in wild places.
              </p>
              <p className="font-sans text-sm leading-relaxed text-mist">
                Inspired by the storytelling traditions of National Geographic
                and the cinematic eye of masters like Paul Nicklen, the work
                seeks to bridge the gap between viewer and subject — creating
                moments of connection that inspire conservation and wonder.
              </p>
              <p className="font-sans text-sm leading-relaxed text-mist">
                From coastal estuaries to mountain ridgelines, each photograph
                is a testament to patience, craft, and the extraordinary beauty
                that exists when we simply pay attention.
              </p>
            </FadeIn>

            <FadeIn delay={0.45} className="mt-12 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
              <div>
                <p className="font-display text-3xl text-gold">{photos.length}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-widest text-mist">
                  Portfolio Images
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-gold">{collectionCount}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-widest text-mist">
                  Collections
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-gold">∞</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-widest text-mist">
                  Patience
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
