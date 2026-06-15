"use client";

import type { Photo } from "@/data/photos";
import {
  getFacebookShareUrl,
  getPhotoShareUrl,
  getTwitterShareUrl,
} from "@/lib/share";

interface PhotoShareButtonsProps {
  photo: Photo;
}

export default function PhotoShareButtons({ photo }: PhotoShareButtonsProps) {
  const shareUrl = getPhotoShareUrl(photo.id);
  const shareText = `${photo.title} — wildlife photography by Darth Grapher`;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="font-sans text-[10px] uppercase tracking-widest text-mist/70">
        Share
      </span>
      <a
        href={getTwitterShareUrl(shareUrl, shareText)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-ivory"
        aria-label={`Share ${photo.title} on X`}
      >
        X
      </a>
      <a
        href={getFacebookShareUrl(shareUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-ivory"
        aria-label={`Share ${photo.title} on Facebook`}
      >
        Facebook
      </a>
    </div>
  );
}
