"use client";

import { useState } from "react";
import type { Photo } from "@/data/photos";
import PhotoCard from "./PhotoCard";
import Lightbox from "./Lightbox";

interface PhotoGridProps {
  photos: Photo[];
  selectedPhoto?: Photo | null;
  selectedIndex?: number;
  onSelectPhoto?: (photo: Photo) => void;
  onClosePhoto?: () => void;
  onNavigatePhoto?: (direction: "prev" | "next") => void;
}

const aspects: Array<"square" | "portrait" | "landscape" | "tall"> = [
  "landscape",
  "tall",
  "square",
  "portrait",
  "landscape",
  "tall",
];

export default function PhotoGrid({
  photos,
  selectedPhoto: controlledPhoto,
  selectedIndex: controlledIndex = -1,
  onSelectPhoto,
  onClosePhoto,
  onNavigatePhoto,
}: PhotoGridProps) {
  const [internalPhoto, setInternalPhoto] = useState<Photo | null>(null);

  const isControlled = Boolean(onSelectPhoto && onClosePhoto);
  const selectedPhoto = isControlled ? (controlledPhoto ?? null) : internalPhoto;
  const selectedIndex = isControlled
    ? controlledIndex
    : photos.findIndex((p) => p.id === internalPhoto?.id);

  function handleSelect(photo: Photo) {
    if (onSelectPhoto) {
      onSelectPhoto(photo);
    } else {
      setInternalPhoto(photo);
    }
  }

  function handleClose() {
    if (onClosePhoto) {
      onClosePhoto();
    } else {
      setInternalPhoto(null);
    }
  }

  function handleNavigate(direction: "prev" | "next") {
    if (onNavigatePhoto) {
      onNavigatePhoto(direction);
      return;
    }

    if (selectedIndex < 0) return;
    const nextIndex =
      direction === "prev" ? selectedIndex - 1 : selectedIndex + 1;
    if (nextIndex < 0 || nextIndex >= photos.length) return;
    setInternalPhoto(photos[nextIndex]);
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <div key={photo.id} className="mb-4 break-inside-avoid">
            <PhotoCard
              photo={photo}
              index={i}
              aspect={aspects[i % aspects.length]}
              onClick={() => handleSelect(photo)}
            />
          </div>
        ))}
      </div>

      <Lightbox
        photo={selectedPhoto}
        photoIndex={selectedIndex >= 0 ? selectedIndex : undefined}
        photoCount={photos.length}
        onClose={handleClose}
        onPrevious={
          selectedIndex > 0 ? () => handleNavigate("prev") : undefined
        }
        onNext={
          selectedIndex >= 0 && selectedIndex < photos.length - 1
            ? () => handleNavigate("next")
            : undefined
        }
      />
    </>
  );
}
