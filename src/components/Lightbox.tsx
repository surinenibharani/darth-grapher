"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Photo } from "@/data/photos";
import PhotoComments from "@/components/PhotoComments";

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

function CaptionPanel({ photo }: { photo: Photo }) {
  return (
    <aside className="flex min-h-0 flex-col justify-start gap-4 lg:max-h-[85vh] lg:w-96 lg:shrink-0 lg:overflow-y-auto lg:pr-2">
      {photo.birdGroup && (
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
          {photo.birdGroup}
        </p>
      )}
      <h3 className="font-display text-2xl font-light leading-snug text-ivory md:text-3xl">
        {photo.title}
      </h3>
      <p className="font-sans text-xs uppercase tracking-widest text-mist">
        {photo.location}
      </p>
      {photo.notes && (
        <p className="font-sans text-sm leading-relaxed text-mist">
          {photo.notes}
        </p>
      )}
      {photo.instagramUrl && (
        <a
          href={photo.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-ivory"
        >
          View on Instagram
        </a>
      )}
      <PhotoComments photoId={photo.id} />
    </aside>
  );
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!photo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function getFocusableElements(): HTMLElement[] {
      if (!dialogRef.current) return [];
      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
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
  }, [photo, onClose]);

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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void/95 p-4 backdrop-blur-sm md:p-8"
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-6 top-6 z-10 font-sans text-xs uppercase tracking-widest text-mist transition-colors hover:text-ivory"
          >
            Close
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-[90vh] w-full max-w-7xl flex-col gap-6 overflow-y-auto lg:max-h-[85vh] lg:flex-row lg:items-center lg:gap-10 lg:overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex min-h-[40vh] w-full flex-1 items-center justify-center bg-charcoal lg:min-h-0 lg:max-h-[85vh] lg:self-stretch">
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
                  className="max-h-[50vh] w-full object-contain lg:max-h-[85vh]"
                />
              ) : (
                <div className="relative h-[50vh] w-full lg:h-full lg:min-h-[50vh] lg:max-h-[85vh]">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="pointer-events-none object-contain select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    priority
                  />
                </div>
              )}
            </div>

            <CaptionPanel photo={photo} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
