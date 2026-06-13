import HomePageClient from "@/components/HomePageClient";
import {
  getFeaturedPhotos,
  getHeroPhoto,
  isUsingInstagramFeed,
} from "@/lib/photos";

export default async function HomePage() {
  const [featuredPhotos, heroPhoto, usingInstagram] = await Promise.all([
    getFeaturedPhotos(),
    getHeroPhoto(),
    isUsingInstagramFeed(),
  ]);

  return (
    <HomePageClient
      featuredPhotos={featuredPhotos}
      heroPhoto={heroPhoto}
      usingInstagram={usingInstagram}
    />
  );
}
