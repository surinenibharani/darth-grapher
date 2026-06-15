import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import {
  getHeroPhoto,
  getSelectedMoments,
  isUsingInstagramFeed,
} from "@/lib/photos";
import { pageMetadata, siteConfig } from "@/lib/metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getHeroPhoto();

  return pageMetadata({
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    path: "/",
    ogImage: hero?.src ?? siteConfig.defaultOgImage,
    absoluteTitle: true,
  });
}

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
