import type { Photo } from "@/data/photos";

const CLOSE_UP_KEYWORDS = [
  "portrait",
  "close up",
  "close-up",
  "closeup",
  "cropped close",
  "eyes",
  "stare",
  "staring",
  "face",
  "head",
  "regal",
  "majestic",
  "innocent",
  "piercing",
  "awe-inspiring",
  "eye",
  "profile",
  "intimate",
];

export function closeUpScore(photo: Photo): number {
  const text = `${photo.title} ${photo.notes}`.toLowerCase();
  let score = 0;

  for (const keyword of CLOSE_UP_KEYWORDS) {
    if (text.includes(keyword)) score += 3;
  }

  if (photo.birdGroup) score += 1;

  return score;
}

function dedupeKey(photo: Photo): string {
  return photo.instagramUrl ?? photo.id;
}

export function selectBirdCloseUps(
  photos: Photo[],
  limit = 9,
  excludeIds: string[] = []
): Photo[] {
  const excluded = new Set(excludeIds);
  const birds = photos.filter(
    (photo) =>
      photo.species === "birds" &&
      photo.mediaType !== "VIDEO" &&
      !excluded.has(photo.id)
  );

  const scored = birds
    .map((photo) => ({ photo, score: closeUpScore(photo) }))
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const selected: Photo[] = [];

  for (const { photo } of scored) {
    const key = dedupeKey(photo);
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(photo);
    if (selected.length >= limit) return selected;
  }

  return selected;
}
