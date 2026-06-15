"use client";

import type { Photo } from "@/data/photos";
import {
  FacebookShareIcon,
  IMessageShareIcon,
  XShareIcon,
} from "@/components/ShareBrandIcons";
import {
  getFacebookShareUrl,
  getIMessageShareUrl,
  getPhotoShareUrl,
  getTwitterShareUrl,
} from "@/lib/share";

interface PhotoShareButtonsProps {
  photo: Photo;
}

const shareLinkClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-smoke/40 transition-all hover:border-white/20 hover:bg-smoke/70";

export default function PhotoShareButtons({ photo }: PhotoShareButtonsProps) {
  const shareUrl = getPhotoShareUrl(photo.id);
  const shareText = `${photo.title} — wildlife photography by Darth Grapher`;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="mr-1 font-sans text-[10px] uppercase tracking-widest text-mist/70">
        Share
      </span>
      <a
        href={getTwitterShareUrl(shareUrl, shareText)}
        target="_blank"
        rel="noopener noreferrer"
        className={shareLinkClass}
        aria-label={`Share ${photo.title} on X`}
        title="Share on X"
      >
        <XShareIcon />
      </a>
      <a
        href={getFacebookShareUrl(shareUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className={shareLinkClass}
        aria-label={`Share ${photo.title} on Facebook`}
        title="Share on Facebook"
      >
        <FacebookShareIcon />
      </a>
      <a
        href={getIMessageShareUrl(shareUrl, shareText)}
        className={shareLinkClass}
        aria-label={`Share ${photo.title} via iMessage`}
        title="Share via iMessage"
      >
        <IMessageShareIcon />
      </a>
    </div>
  );
}
