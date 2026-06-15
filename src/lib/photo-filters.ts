import type { Photo, Species } from "@/data/photos";
import { speciesLabels } from "@/data/photos";

export type PhotoFilterState = {
  species: Species | "all";
  location: string;
  year: string;
};

export const emptyPhotoFilters: PhotoFilterState = {
  species: "all",
  location: "all",
  year: "all",
};

export function getPhotoYear(photo: Photo): number | null {
  if (!photo.publishedAt) return null;
  const year = new Date(photo.publishedAt).getFullYear();
  return Number.isNaN(year) ? null : year;
}

export function getPhotoFilterOptions(photos: Photo[]) {
  const locations = new Set<string>();
  const years = new Set<number>();

  for (const photo of photos) {
    if (photo.location.trim()) locations.add(photo.location.trim());
    const year = getPhotoYear(photo);
    if (year) years.add(year);
  }

  return {
    locations: Array.from(locations).sort((a, b) => a.localeCompare(b)),
    years: Array.from(years).sort((a, b) => b - a),
    species: (Object.keys(speciesLabels) as Species[]).filter((species) =>
      photos.some((photo) => photo.species === species)
    ),
  };
}

export function filterPhotos(
  photos: Photo[],
  filters: PhotoFilterState
): Photo[] {
  return photos.filter((photo) => {
    if (filters.species !== "all" && photo.species !== filters.species) {
      return false;
    }
    if (
      filters.location !== "all" &&
      photo.location.trim() !== filters.location
    ) {
      return false;
    }
    if (filters.year !== "all") {
      const year = getPhotoYear(photo);
      if (year === null || String(year) !== filters.year) return false;
    }
    return true;
  });
}

export function hasActiveFilters(filters: PhotoFilterState): boolean {
  return (
    filters.species !== "all" ||
    filters.location !== "all" ||
    filters.year !== "all"
  );
}
