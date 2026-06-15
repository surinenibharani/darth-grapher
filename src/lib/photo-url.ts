/** URL-safe path for a single portfolio photo. */
export function photoPortfolioPath(photoId: string): string {
  return `/portfolio/${encodeURIComponent(photoId)}`;
}

export function decodePhotoId(encoded: string): string {
  return decodeURIComponent(encoded);
}
