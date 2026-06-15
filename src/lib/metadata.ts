import type { Metadata } from "next";

export const siteConfig = {
  name: "Darth Grapher",
  tagline: "Wildlife Photography",
  description:
    "Wildlife photography portfolio by Darth Grapher — intimate portraits of Pennsylvania birds, raptors, and nature. Live from @darthgrapher on Instagram.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://darth-grapher.vercel.app",
  locale: "en_US",
  defaultOgImage: "/images/about-tree-swallow.jpg",
  twitterHandle: "@darthgrapher",
};

export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path) return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

type OgImageInput =
  | string
  | { url: string; width?: number; height?: number; alt?: string };

type OgImageDescriptor = {
  url: string | URL;
  width?: number;
  height?: number;
  alt?: string;
};

function ogImageUrl(img: string | URL | OgImageDescriptor): string {
  if (typeof img === "string") return img;
  if (img instanceof URL) return img.toString();
  return typeof img.url === "string" ? img.url : img.url.toString();
}

function resolveOgImages(
  ogImage: OgImageInput | undefined,
  fallbackAlt: string
): NonNullable<Metadata["openGraph"]>["images"] {
  if (!ogImage) {
    return [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ];
  }

  if (typeof ogImage === "string") {
    const url = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);
    return [{ url, alt: fallbackAlt }];
  }

  return [
    {
      url: ogImage.url.startsWith("http")
        ? ogImage.url
        : absoluteUrl(ogImage.url),
      width: ogImage.width,
      height: ogImage.height,
      alt: ogImage.alt ?? fallbackAlt,
    },
  ];
}

export function pageMetadata({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: OgImageInput;
  ogType?: "website" | "article";
  absoluteTitle?: boolean;
}): Metadata {
  const url = path ? absoluteUrl(path) : siteConfig.url;
  const images = resolveOgImages(ogImage, title);
  const imageList = images
    ? Array.isArray(images)
      ? images
      : [images]
    : [];
  const imageUrls = imageList.map((img) =>
    ogImageUrl(img as string | URL | OgImageDescriptor)
  );

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls,
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "wildlife photography",
    "bird photography",
    "Pennsylvania birds",
    "nature photography",
    "Darth Grapher",
    "raptors",
    "Instagram photographer",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Tree swallow wildlife portrait`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.defaultOgImage)],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
  icons: {
    icon: siteConfig.defaultOgImage,
    apple: siteConfig.defaultOgImage,
  },
};
