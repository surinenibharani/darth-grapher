import "server-only";

import { unstable_cache } from "next/cache";
import type { Photo, Species } from "@/data/photos";
import {
  ABOUT_PORTRAIT_SHORTCODE,
  aboutPortrait,
  fallbackPhotos,
} from "@/data/photos";
import { fetchInstagramPhotos, isInstagramConfigured } from "@/lib/instagram";
import { checkInstagramHealth } from "@/lib/instagram-health";
import { selectBirdCloseUps } from "@/lib/photo-selection";

/** Cache Instagram feed for 1 hour — one fetch shared across all pages. */
const INSTAGRAM_CACHE_SECONDS = 3600;

const getCachedInstagramPhotos = unstable_cache(
  async () => fetchInstagramPhotos(100),
  ["instagram-photos"],
  { revalidate: INSTAGRAM_CACHE_SECONDS, tags: ["instagram"] }
);

const getCachedInstagramHealth = unstable_cache(
  async () => checkInstagramHealth(),
  ["instagram-health"],
  { revalidate: 300, tags: ["instagram"] }
);

async function logInstagramFailure(error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[Instagram] Feed fetch failed:", message);

  try {
    const health = await getCachedInstagramHealth();
    if (!health.ok) {
      console.error("[Instagram] Health check:", health.error);
      if (health.hint) console.error("[Instagram] Fix:", health.hint);
    }
  } catch (healthError) {
    console.error("[Instagram] Health check failed:", healthError);
  }
}

export async function getPhotos(): Promise<Photo[]> {
  if (!isInstagramConfigured()) {
    return fallbackPhotos;
  }

  try {
    return await getCachedInstagramPhotos();
  } catch (error) {
    await logInstagramFailure(error);
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

  return fromFeed ?? aboutPortrait;
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

/** Server-only diagnostic — run via `npm run check:instagram`. */
export async function getInstagramFeedStatus(): Promise<{
  configured: boolean;
  feedOk: boolean;
  health: Awaited<ReturnType<typeof checkInstagramHealth>>;
}> {
  const configured = isInstagramConfigured();
  if (!configured) {
    return {
      configured: false,
      feedOk: false,
      health: {
        ok: false,
        error: "Instagram env vars not configured.",
        hint: "Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in .env.local (server-side only).",
      },
    };
  }

  const health = await checkInstagramHealth();
  let feedOk = false;

  try {
    await getCachedInstagramPhotos();
    feedOk = true;
  } catch {
    feedOk = false;
  }

  return { configured, feedOk, health };
}
