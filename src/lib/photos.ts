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

function sortPhotosByNewest(photos: Photo[]): Photo[] {
  return [...photos].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });
}

/** Picks a stable hero for the current UTC day (ISR-friendly, crawler-consistent). */
function pickDailyHero(items: Photo[]): Photo | null {
  if (items.length === 0) return null;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return items[dayIndex % items.length];
}

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

  const health = await checkInstagramHealth();
  if (!health.ok) {
    console.error("[Instagram] Health check failed, using fallback photos.");
    if (health.error) console.error("[Instagram] Health check:", health.error);
    if (health.hint) console.error("[Instagram] Fix:", health.hint);
    return fallbackPhotos;
  }

  try {
    return sortPhotosByNewest(await getCachedInstagramPhotos());
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

/** Hero: daily-rotating bird still — stable within each UTC day for SEO/caching. */
export async function getHeroPhoto(): Promise<Photo | null> {
  const photos = await getPhotos();
  const birdPortraits = photos.filter(
    (photo) => photo.species === "birds" && photo.mediaType !== "VIDEO"
  );

  return (
    pickDailyHero(birdPortraits) ??
    pickDailyHero(photos.filter((photo) => photo.species === "birds")) ??
    pickDailyHero(photos.filter((photo) => photo.mediaType !== "VIDEO")) ??
    photos[0] ??
    null
  );
}

/** User-visible notice when Instagram is configured but the feed is unavailable. */
export async function getInstagramFeedWarning(): Promise<string | null> {
  if (!isInstagramConfigured()) return null;

  const feedOk = await isUsingInstagramFeed();
  if (feedOk) return null;

  return "Instagram feed is temporarily unavailable — showing saved photos until the connection is restored.";
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

  const health = await checkInstagramHealth();
  if (!health.ok) return false;

  try {
    await getCachedInstagramPhotos();
    return true;
  } catch {
    return false;
  }
}

/** Count collections: bird species groups + one per non-bird species with photos. */
export function getCollectionCount(photos: Photo[]): number {
  const speciesWithPhotos = new Set(photos.map((photo) => photo.species));
  let count = 0;

  for (const species of speciesWithPhotos) {
    if (species === "birds") {
      const birdGroups = new Set(
        photos
          .filter((photo) => photo.species === "birds" && photo.birdGroup)
          .map((photo) => photo.birdGroup)
      );
      count += birdGroups.size > 0 ? birdGroups.size : 1;
    } else {
      count += 1;
    }
  }

  return count;
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
