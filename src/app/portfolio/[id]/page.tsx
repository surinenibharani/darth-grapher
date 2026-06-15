import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioPageContent from "@/components/PortfolioPageContent";
import { decodePhotoId } from "@/lib/photo-url";
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
    return { title: "Photo Not Found | Darth Grapher" };
  }

  return {
    title: `${photo.title} | Darth Grapher`,
    description: photo.notes || photo.title,
    openGraph: {
      title: photo.title,
      description: photo.notes || photo.title,
      images: [{ url: photo.src }],
    },
  };
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
