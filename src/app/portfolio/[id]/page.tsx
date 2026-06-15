import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioPageContent from "@/components/PortfolioPageContent";
import { decodePhotoId, photoPortfolioPath } from "@/lib/photo-url";
import { pageMetadata } from "@/lib/metadata";
import { getPhotoById } from "@/lib/photos";

export const revalidate = 3600;

interface PhotoPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PhotoPageProps): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhotoById(decodePhotoId(id));

  if (!photo) {
    return { title: "Photo Not Found" };
  }

  const description =
    photo.notes?.trim().slice(0, 160) ||
    `${photo.title} — wildlife photography by Darth Grapher in ${photo.location}.`;

  return pageMetadata({
    title: photo.title,
    description,
    path: photoPortfolioPath(photo.id),
    ogImage: photo.src,
    ogType: "article",
  });
}

export default async function PortfolioPhotoPage({ params }: PhotoPageProps) {
  const { id } = await params;
  const photoId = decodePhotoId(id);
  const photo = await getPhotoById(photoId);

  if (!photo) {
    notFound();
  }

  return <PortfolioPageContent initialPhotoId={photoId} />;
}
