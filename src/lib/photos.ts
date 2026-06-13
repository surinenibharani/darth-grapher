import { unstable_cache } from "next/cache";
import type { Photo, Species } from "@/data/photos";
import {
  ABOUT_PORTRAIT_SHORTCODE,
  aboutPortrait,
  fallbackPhotos,
} from "@/data/photos";
import { fetchInstagramPhotos, isInstagramConfigured } from "@/lib/instagram";
import { selectBirdCloseUps } from "@/lib/photo-selection";

const getCachedInstagramPhotos = unstable_cache(
  async () => fetchInstagramPhotos(100),
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

/** Nine close-up bird stills for the home page Selected Moments grid. */
export async function getSelectedMoments(
  excludeId?: string
): Promise<Photo[]> {
  const photos = await getPhotos();
  return selectBirdCloseUps(photos, 9, excludeId ? [excludeId] : []);
}

/** Instagram video posts only. */
export async function getVideoPosts(): Promise<Photo[]> {
  const photos = await getPhotos();
  return photos.filter(
    (photo) => photo.mediaType === "VIDEO" || Boolean(photo.videoUrl)
  );
}

/** Hero: random bird still image on each page load — never a video thumbnail. */
export async function getHeroPhoto(): Promise<Photo | null> {
  const photos = await getPhotos();
  const birdPortraits = photos.filter(
    (photo) => photo.species === "birds" && photo.mediaType !== "VIDEO"
  );

  const pickRandom = (items: Photo[]) =>
    items.length > 0
      ? items[Math.floor(Math.random() * items.length)]
      : null;

  return (
    pickRandom(birdPortraits) ??
    pickRandom(photos.filter((photo) => photo.species === "birds")) ??
    pickRandom(photos.filter((photo) => photo.mediaType !== "VIDEO")) ??
    photos[0] ??
    null
  );
}

export async function getPhotosBySpecies(species: Species): Promise<Photo[]> {
  const photos = await getPhotos();
  return photos.filter((photo) => photo.species === species);
}

/** About page portrait — tree swallow from Instagram post DY2ygCTuPcX. */
export async function getAboutPortrait(): Promise<Photo> {
  const photos = await getPhotos();
  const fromFeed = photos.find((photo) =>
    photo.instagramUrl?.includes(ABOUT_PORTRAIT_SHORTCODE)
  );

  if (fromFeed) return fromFeed;

  if (isInstagramConfigured()) {
    try {
      const extended = await fetchInstagramPhotos(100);
      const match = extended.find((photo) =>
        photo.instagramUrl?.includes(ABOUT_PORTRAIT_SHORTCODE)
      );
      if (match) return match;
    } catch {
      // Fall through to local portrait
    }
  }

  return aboutPortrait;
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
