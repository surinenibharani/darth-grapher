import { photoPortfolioPath } from "@/lib/photo-url";

const fallbackSiteUrl = "https://darth-grapher.vercel.app";

export function getPhotoShareUrl(photoId: string): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl
  ).replace(/\/$/, "");
  return `${base}${photoPortfolioPath(photoId)}`;
}

export function getTwitterShareUrl(url: string, text: string): string {
  const params = new URLSearchParams({ url, text });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function getFacebookShareUrl(url: string): string {
  const params = new URLSearchParams({ u: url });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/** Opens Messages on iPhone/Mac with a pre-filled iMessage body. */
export function getIMessageShareUrl(url: string, text: string): string {
  const body = `${text}\n${url}`;
  return `sms:&body=${encodeURIComponent(body)}`;
}
