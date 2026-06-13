import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { getAboutPortrait, getCollectionCount, getPhotos } from "@/lib/photos";

export const metadata = {
  title: "About | Darth Grapher",
  description: "Learn about the photographer behind Darth Grapher.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const [photos, portrait] = await Promise.all([getPhotos(), getAboutPortrait()]);
  const collectionCount = getCollectionCount(photos);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <FadeIn>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={portrait.src}
                alt={portrait.title}
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
                Darth Grapher is a wildlife photographer guided by a profound
                respect for the natural world. Every image begins long before the
                shutter clicks — in pre-dawn hikes, patient hours of stillness,
                and the humble awareness that we are only guests in these wild
                places.
              </p>
              <p className="font-sans text-sm leading-relaxed text-mist">
                Inspired by the powerful storytelling of National Geographic and
                the evocative narration of Sir David Attenborough, his work aims
                to bridge the gap between viewer and subject. Through quiet,
                intimate moments, he seeks to spark a deeper connection with
                nature — one that inspires conservation and a lasting sense of
                wonder.
              </p>
              <p className="font-sans text-sm leading-relaxed text-mist">
                From misty coastal estuaries to rugged mountain ridgelines, each
                photograph reflects patience, dedication, and the extraordinary
                beauty revealed when we simply slow down and pay attention.
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
