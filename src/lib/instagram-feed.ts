import "server-only";

import { unstable_cache } from "next/cache";
import { fetchInstagramPhotos, isInstagramConfigured } from "@/lib/instagram";
import { checkInstagramHealth } from "@/lib/instagram-health";

/** Shared revalidation window for Instagram feed data (1 hour). */
export const INSTAGRAM_FEED_REVALIDATE_SECONDS = 3600;

/** Cache tag for on-demand revalidation via route handler / cron. */
export const INSTAGRAM_CACHE_TAG = "instagram";

const getCachedInstagramPhotos = unstable_cache(
  async () => fetchInstagramPhotos(100),
  ["instagram-photos"],
  {
    revalidate: INSTAGRAM_FEED_REVALIDATE_SECONDS,
    tags: [INSTAGRAM_CACHE_TAG],
  }
);

const getCachedInstagramHealth = unstable_cache(
  async () => checkInstagramHealth(),
  ["instagram-health"],
  { revalidate: 300, tags: [INSTAGRAM_CACHE_TAG] }
);

export async function getInstagramHealth() {
  return getCachedInstagramHealth();
}

/** Server-only Instagram feed — cached across requests, never called from the browser. */
export async function getInstagramFeedPhotos() {
  return getCachedInstagramPhotos();
}

export { isInstagramConfigured };
