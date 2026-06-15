import Image, { type ImageProps } from "next/image";

type OptimizedImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  /** Set true for above-the-fold heroes only — disables lazy loading. */
  priority?: boolean;
};

/**
 * Wrapper around next/image with lazy loading and AVIF/WebP optimization defaults.
 * Grid and below-fold images lazy-load automatically; pass priority only for LCP heroes.
 */
export default function OptimizedImage({
  priority = false,
  quality = 80,
  loading,
  alt,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      alt={alt}
      quality={quality}
      priority={priority}
      loading={priority ? undefined : (loading ?? "lazy")}
      {...props}
    />
  );
}
