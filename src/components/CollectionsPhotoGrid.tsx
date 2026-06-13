"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/data/photos";
import Lightbox from "@/components/Lightbox";
import VideoPlayButton, { isVideoPost } from "@/components/VideoPlayButton";

interface CollectionsPhotoGridProps {
  photos: Photo[];
}

export default function CollectionsPhotoGrid({
  photos,
}: CollectionsPhotoGridProps) {
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelected(photo)}
            className="group relative aspect-square cursor-zoom-in overflow-hidden"
          >
            <Image
              src={photo.src}
              alt={photo.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="pointer-events-none object-cover select-none transition-transform duration-700 group-hover:scale-105"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            {isVideoPost(photo) && <VideoPlayButton size="sm" />}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-void/80 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <p className="font-sans text-[10px] uppercase tracking-widest text-ivory">
                {photo.title}
              </p>
            </div>
          </button>
        ))}
      </div>
      <Lightbox photo={selected} onClose={() => setSelected(null)} />
    </>
  );
}
