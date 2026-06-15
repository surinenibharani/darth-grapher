"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Photo } from "@/data/photos";
import { photoPortfolioPath } from "@/lib/photo-url";
import {
  emptyPhotoFilters,
  filterPhotos,
  type PhotoFilterState,
} from "@/lib/photo-filters";
import PhotoFilters from "@/components/PhotoFilters";
import PhotoGrid from "@/components/PhotoGrid";

interface PortfolioGalleryProps {
  photos: Photo[];
  initialPhotoId?: string;
}

export default function PortfolioGallery({
  photos,
  initialPhotoId,
}: PortfolioGalleryProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<PhotoFilterState>(emptyPhotoFilters);

  const filteredPhotos = useMemo(
    () => filterPhotos(photos, filters),
    [photos, filters]
  );

  const selectedIndex = useMemo(() => {
    if (!initialPhotoId) return -1;
    return filteredPhotos.findIndex((photo) => photo.id === initialPhotoId);
  }, [filteredPhotos, initialPhotoId]);

  const selectedPhoto = selectedIndex >= 0 ? filteredPhotos[selectedIndex] : null;

  useEffect(() => {
    if (!initialPhotoId) return;
    const inFiltered = filteredPhotos.some((p) => p.id === initialPhotoId);
    if (!inFiltered) {
      router.replace("/portfolio", { scroll: false });
    }
  }, [filteredPhotos, initialPhotoId, router]);

  const openPhoto = useCallback(
    (photo: Photo) => {
      router.push(photoPortfolioPath(photo.id), { scroll: false });
    },
    [router]
  );

  const closePhoto = useCallback(() => {
    router.push("/portfolio", { scroll: false });
  }, [router]);

  const navigatePhoto = useCallback(
    (direction: "prev" | "next") => {
      if (selectedIndex < 0) return;
      const nextIndex =
        direction === "prev" ? selectedIndex - 1 : selectedIndex + 1;
      if (nextIndex < 0 || nextIndex >= filteredPhotos.length) return;
      router.push(photoPortfolioPath(filteredPhotos[nextIndex].id), {
        scroll: false,
      });
    },
    [filteredPhotos, router, selectedIndex]
  );

  return (
    <div className="space-y-6">
      <PhotoFilters
        photos={photos}
        filters={filters}
        resultCount={filteredPhotos.length}
        onChange={setFilters}
      />

      {filteredPhotos.length === 0 ? (
        <div className="border border-white/5 bg-smoke/20 px-6 py-16 text-center">
          <p className="font-display text-2xl text-ivory">No photos match</p>
          <p className="mt-3 font-sans text-sm text-mist">
            Try adjusting species, location, or year.
          </p>
          <button
            type="button"
            onClick={() => setFilters(emptyPhotoFilters)}
            className="mt-6 font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-ivory"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <PhotoGrid
          photos={filteredPhotos}
          selectedPhoto={selectedPhoto}
          selectedIndex={selectedIndex}
          onSelectPhoto={openPhoto}
          onClosePhoto={closePhoto}
          onNavigatePhoto={navigatePhoto}
          analyticsSource="portfolio"
        />
      )}
    </div>
  );
}
