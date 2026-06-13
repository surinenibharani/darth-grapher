"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Photo } from "@/data/photos";

interface PhotoCardProps {
  photo: Photo;
  index?: number;
  aspect?: "square" | "portrait" | "landscape" | "tall";
  onClick?: () => void;
}

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  tall: "aspect-[2/3]",
};

export default function PhotoCard({
  photo,
  index = 0,
  aspect = "landscape",
  onClick,
}: PhotoCardProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={`relative block w-full overflow-hidden ${aspectClasses[aspect]} ${onClick ? "cursor-zoom-in" : ""}`}
      >
        <Image
          src={photo.src}
          alt={photo.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="font-display text-xl text-ivory">{photo.title}</p>
          {photo.notes && (
            <p className="mt-2 line-clamp-2 font-sans text-xs leading-relaxed text-mist/90">
              {photo.notes}
            </p>
          )}
          <p className="mt-2 font-sans text-xs uppercase tracking-widest text-mist">
            {photo.location}
          </p>
        </div>
      </Wrapper>
    </motion.div>
  );
}
