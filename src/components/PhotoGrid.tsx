"use client";

import { useState } from "react";
import type { Photo } from "@/data/photos";
import PhotoCard from "./PhotoCard";
import Lightbox from "./Lightbox";

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [selected, setSelected] = useState<Photo | null>(null);

  const aspects: Array<"square" | "portrait" | "landscape" | "tall"> = [
    "landscape",
    "tall",
    "square",
    "portrait",
    "landscape",
    "tall",
  ];

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <div key={photo.id} className="mb-4 break-inside-avoid">
            <PhotoCard
              photo={photo}
              index={i}
              aspect={aspects[i % aspects.length]}
              onClick={() => setSelected(photo)}
            />
          </div>
        ))}
      </div>
      <Lightbox photo={selected} onClose={() => setSelected(null)} />
    </>
  );
}
