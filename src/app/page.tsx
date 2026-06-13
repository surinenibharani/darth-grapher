import HomePageClient from "@/components/HomePageClient";
import {
  getHeroPhoto,
  getSelectedMoments,
  isUsingInstagramFeed,
} from "@/lib/photos";

export const revalidate = 3600;

export default async function HomePage() {
  const heroPhoto = await getHeroPhoto();
  const [selectedMoments, usingInstagram] = await Promise.all([
    getSelectedMoments(heroPhoto?.id),
    isUsingInstagramFeed(),
  ]);

  return (
    <HomePageClient
      selectedMoments={selectedMoments}
      heroPhoto={heroPhoto}
      usingInstagram={usingInstagram}
    />
  );
}
