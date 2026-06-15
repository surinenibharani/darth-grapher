import type { Photo } from "@/data/photos";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPhotoOpen(
  photo: Photo,
  source: string,
  photoIndex?: number
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "photo_open", {
    photo_id: photo.id,
    photo_title: photo.title,
    species: photo.species,
    bird_group: photo.birdGroup ?? "",
    media_type: photo.mediaType ?? "IMAGE",
    source,
    photo_position: photoIndex !== undefined ? photoIndex + 1 : undefined,
  });
}
