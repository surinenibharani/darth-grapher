import HomePageClient from "@/components/HomePageClient";
import { getFeaturedPhotos, isUsingInstagramFeed } from "@/lib/photos";

export default async function HomePage() {
  const [featuredPhotos, usingInstagram] = await Promise.all([
    getFeaturedPhotos(),
    isUsingInstagramFeed(),
  ]);

  return (
    <HomePageClient
      featuredPhotos={featuredPhotos}
      usingInstagram={usingInstagram}
    />
  );
}
