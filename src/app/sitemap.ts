import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/metadata";
import { photoPortfolioPath } from "@/lib/photo-url";
import { getPhotos } from "@/lib/photos";

const staticRoutes = [
  "/",
  "/portfolio",
  "/collections",
  "/videos",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const photos = await getPhotos();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const photoEntries: MetadataRoute.Sitemap = photos.map((photo) => ({
    url: absoluteUrl(photoPortfolioPath(photo.id)),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...photoEntries];
}
