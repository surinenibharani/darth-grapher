import type { Photo } from "@/data/photos";

export function isVideoPost(photo: Photo): boolean {
  return Boolean(photo.videoUrl || photo.mediaType === "VIDEO");
}

interface VideoPlayButtonProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { outer: "h-9 w-9", icon: "ml-0.5 h-3.5 w-3.5" },
  md: { outer: "h-12 w-12", icon: "ml-1 h-5 w-5" },
  lg: { outer: "h-14 w-14", icon: "ml-1 h-6 w-6" },
};

export default function VideoPlayButton({
  size = "md",
  className = "",
}: VideoPlayButtonProps) {
  const { outer, icon } = sizes[size];

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center ${className}`}
      aria-hidden
    >
      <div
        className={`flex ${outer} items-center justify-center rounded-full border border-gold/40 bg-void/70 shadow-lg backdrop-blur-sm`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${icon} text-gold`}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}
