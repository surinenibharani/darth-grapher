import { unstable_cache } from "next/cache";
import type { Photo, Species } from "@/data/photos";
import { fallbackPhotos } from "@/data/photos";
import { fetchInstagramPhotos, isInstagramConfigured } from "@/lib/instagram";

const getCachedInstagramPhotos = unstable_cache(
  async () => fetchInstagramPhotos(),
  ["instagram-photos"],
  { revalidate: 3600, tags: ["instagram"] }
);

export async function getPhotos(): Promise<Photo[]> {
  if (!isInstagramConfigured()) {
    return fallbackPhotos;
  }

  try {
    return await getCachedInstagramPhotos();
  } catch (error) {
    console.error("Failed to load Instagram photos:", error);
    return fallbackPhotos;
  }
}

export async function getFeaturedPhotos(): Promise<Photo[]> {
  const photos = await getPhotos();
  const featured = photos.filter((photo) => photo.featured);
  return featured.length > 0 ? featured : photos.slice(0, 5);
}

export async function getPhotosBySpecies(species: Species): Promise<Photo[]> {
  const photos = await getPhotos();
  return photos.filter((photo) => photo.species === species);
}

export async function isUsingInstagramFeed(): Promise<boolean> {
  if (!isInstagramConfigured()) return false;

  try {
    await getCachedInstagramPhotos();
    return true;
  } catch {
    return false;
  }
}
