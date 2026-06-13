import "server-only";

import { getPhotos } from "@/lib/photos";
import type { Photo } from "@/data/photos";

export interface LatestPost {
  id: string;
  title: string;
  permalink: string;
  thumbnail: string;
  timestamp: string;
  mediaType?: string;
}

export async function getLatestInstagramPost(): Promise<LatestPost | null> {
  const photos = await getPhotos();
  if (photos.length === 0) return null;

  const latest = photos[0];
  return toLatestPost(latest);
}

export function toLatestPost(photo: Photo): LatestPost {
  return {
    id: photo.id,
    title: photo.title,
    permalink: photo.instagramUrl ?? "",
    thumbnail: photo.src,
    timestamp: photo.id,
    mediaType: photo.mediaType,
  };
}

export async function getRecentPostsForFeed(limit = 20): Promise<LatestPost[]> {
  const photos = await getPhotos();
  return photos.slice(0, limit).map(toLatestPost);
}
