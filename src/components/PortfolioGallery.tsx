"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Photo } from "@/data/photos";
import { photoPortfolioPath } from "@/lib/photo-url";
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

  const selectedIndex = useMemo(() => {
    if (!initialPhotoId) return -1;
    return photos.findIndex((photo) => photo.id === initialPhotoId);
  }, [photos, initialPhotoId]);

  const selectedPhoto = selectedIndex >= 0 ? photos[selectedIndex] : null;

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
      if (nextIndex < 0 || nextIndex >= photos.length) return;
      router.push(photoPortfolioPath(photos[nextIndex].id), { scroll: false });
    },
    [photos, router, selectedIndex]
  );

  return (
    <PhotoGrid
      photos={photos}
      selectedPhoto={selectedPhoto}
      selectedIndex={selectedIndex}
      onSelectPhoto={openPhoto}
      onClosePhoto={closePhoto}
      onNavigatePhoto={navigatePhoto}
    />
  );
}
