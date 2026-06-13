import "server-only";

import { getPhotos } from "@/lib/photos";
import type { Photo } from "@/data/photos";

export interface LatestPost {
  id: string;
  title: string;
  permalink: string;
  thumbnail: string;
  timestamp: string;
  description: string;
  mediaType?: string;
}

function sortByNewest(photos: Photo[]): Photo[] {
  return [...photos].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });
}

export async function getLatestInstagramPost(): Promise<LatestPost | null> {
  const photos = sortByNewest(await getPhotos());
  if (photos.length === 0) return null;

  return toLatestPost(photos[0]);
}

export function toLatestPost(photo: Photo): LatestPost {
  return {
    id: photo.id,
    title: photo.title,
    permalink: photo.instagramUrl ?? "",
    thumbnail: photo.src,
    timestamp: photo.publishedAt ?? "",
    description: photo.notes || photo.title,
    mediaType: photo.mediaType,
  };
}

export async function getRecentPostsForFeed(limit = 20): Promise<LatestPost[]> {
  const photos = sortByNewest(await getPhotos());
  return photos.slice(0, limit).map(toLatestPost);
}
