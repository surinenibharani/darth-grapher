"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Photo } from "@/data/photos";

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void/95 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-6 top-6 font-sans text-xs uppercase tracking-widest text-mist transition-colors hover:text-ivory"
          >
            Close
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[85vh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-6 text-center">
              <h3 className="font-display text-2xl text-ivory md:text-3xl">
                {photo.title}
              </h3>
              <p className="mt-2 font-sans text-xs uppercase tracking-widest text-mist">
                {photo.location}
              </p>
              {photo.notes && (
                <p className="mx-auto mt-4 max-w-2xl font-sans text-sm leading-relaxed text-mist">
                  {photo.notes}
                </p>
              )}
              {photo.instagramUrl && (
                <a
                  href={photo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-ivory"
                >
                  View on Instagram
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
