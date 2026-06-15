import type { Metadata } from "next";
import PhotoGrid from "@/components/PhotoGrid";
import FadeIn from "@/components/FadeIn";
import { getVideoPosts, isUsingInstagramFeed } from "@/lib/photos";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Videos",
  description:
    "Wildlife video moments from @darthgrapher — eagles, birds, and nature in motion.",
  path: "/videos",
});

export const revalidate = 3600;

export default async function VideosPage() {
  const [videos, usingInstagram] = await Promise.all([
    getVideoPosts(),
    isUsingInstagramFeed(),
  ]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <FadeIn>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
            Motion
          </p>
          <h1 className="mt-4 font-display text-5xl font-light text-ivory md:text-6xl">
            In the Wild
          </h1>
          <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-mist">
            {usingInstagram
              ? "Video posts from @darthgrapher — click any thumbnail to watch."
              : "Connect the Instagram Graph API to load your video posts."}
          </p>
        </FadeIn>

        <div className="mt-16">
          {videos.length > 0 ? (
            <PhotoGrid photos={videos} analyticsSource="videos" />
          ) : (
            <p className="font-sans text-sm text-mist">
              No videos available yet. New Instagram reels and video posts will
              appear here automatically.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
