"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Photo } from "@/data/photos";
import PhotoComments from "@/components/PhotoComments";

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
  photoIndex?: number;
  photoCount?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

function firstLine(text: string): string {
  const line = text.trim().split("\n").find(Boolean) ?? text.trim();
  return line;
}

interface CaptionPanelProps {
  photo: Photo;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

function CaptionPanel({
  photo,
  expanded,
  onExpandedChange,
}: CaptionPanelProps) {
  const notesPreview = photo.notes?.trim() ? firstLine(photo.notes) : null;
  const canExpand = Boolean(
    photo.notes?.trim() ||
      photo.birdGroup ||
      photo.instagramUrl ||
      photo.title.length > 60
  );

  return (
    <div
      className="shrink-0 border-t border-white/10 bg-void px-5 py-4 md:px-8 md:py-5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={expanded ? "max-h-[40vh] overflow-y-auto pr-1" : ""}>
        {photo.birdGroup && expanded && (
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
            {photo.birdGroup}
          </p>
        )}

        <h3
          className={`font-display font-light text-ivory ${
            expanded
              ? "mt-2 text-2xl leading-snug md:text-3xl"
              : "truncate text-xl md:text-2xl"
          }`}
        >
          {photo.title}
        </h3>

        <p className="mt-1 font-sans text-xs uppercase tracking-widest text-mist">
          {photo.location}
        </p>

        {notesPreview && (
          <p
            className={`mt-3 font-sans text-sm leading-relaxed text-mist/90 ${
              expanded ? "" : "line-clamp-1"
            }`}
          >
            {expanded ? photo.notes : notesPreview}
          </p>
        )}

        {expanded && photo.instagramUrl && (
          <a
            href={photo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-ivory"
          >
            View on Instagram
          </a>
        )}

        {expanded && <PhotoComments photoId={photo.id} />}
      </div>

      {canExpand && (
        <button
          type="button"
          onClick={() => onExpandedChange(!expanded)}
          className="mt-3 font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-ivory"
          aria-expanded={expanded}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}

export default function Lightbox({
  photo,
  onClose,
  photoIndex,
  photoCount,
  onPrevious,
  onNext,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [photo?.id]);

  useEffect(() => {
    if (!photo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function getFocusableElements(): HTMLElement[] {
      if (!dialogRef.current) return [];
      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], video[controls], textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" && onPrevious) {
        event.preventDefault();
        onPrevious();
        return;
      }

      if (event.key === "ArrowRight" && onNext) {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, onClose, onPrevious, onNext]);

  function handlePhotoClick() {
    if (expanded) {
      setExpanded(false);
    }
  }

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col bg-void"
        >
          <div
            role={expanded ? "button" : undefined}
            tabIndex={expanded ? 0 : -1}
            aria-label={expanded ? "Collapse caption" : undefined}
            onClick={handlePhotoClick}
            onKeyDown={(event) => {
              if (
                expanded &&
                (event.key === "Enter" || event.key === " ")
              ) {
                event.preventDefault();
                setExpanded(false);
              }
            }}
            className="relative min-h-0 flex-1 bg-void"
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-5 top-5 z-20 font-sans text-xs uppercase tracking-widest text-mist transition-colors hover:text-ivory md:right-8 md:top-8"
            >
              Close
            </button>

            {onPrevious && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious();
                }}
                className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 bg-void/60 font-sans text-xl text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:text-gold md:left-6"
              >
                ‹
              </button>
            )}

            {onNext && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 bg-void/60 font-sans text-xl text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:text-gold md:right-6"
              >
                ›
              </button>
            )}

            {photoIndex !== undefined && photoCount !== undefined && photoCount > 1 && (
              <p className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 font-sans text-[10px] uppercase tracking-widest text-mist/70">
                {photoIndex + 1} / {photoCount}
              </p>
            )}

            {photo.videoUrl ? (
              <video
                src={photo.videoUrl}
                poster={photo.src}
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                playsInline
                autoPlay
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto h-full w-full object-contain"
              />
            ) : (
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes="100vw"
                className="pointer-events-none object-contain select-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                priority
              />
            )}
          </div>

          <CaptionPanel
            photo={photo}
            expanded={expanded}
            onExpandedChange={setExpanded}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
