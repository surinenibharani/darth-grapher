import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import FeedSubscribeActions from "@/components/FeedSubscribeActions";
import { absoluteUrl, pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "RSS Feed",
  description:
    "Subscribe to Darth Grapher wildlife photography updates via RSS — works in Feedly, Apple News, and any RSS reader.",
  path: "/feed",
});

export default function FeedPage() {
  const feedUrl = absoluteUrl("/feed.xml");

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-2xl px-6 lg:px-10">
        <FadeIn>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
            Stay Updated
          </p>
          <h1 className="mt-4 font-display text-4xl font-light text-ivory md:text-5xl">
            Subscribe via RSS
          </h1>
          <p className="mt-6 font-sans text-sm leading-relaxed text-mist">
            RSS delivers new wildlife photos to your favorite reader — no account
            on this site required. Copy the feed URL below or open it directly in
            Feedly.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <FeedSubscribeActions feedUrl={feedUrl} />
        </FadeIn>

        <FadeIn delay={0.2} className="mt-12 space-y-4">
          <p className="font-sans text-xs uppercase tracking-widest text-gold">
            Apple / iOS
          </p>
          <p className="font-sans text-sm leading-relaxed text-mist">
            In the News app, go to Channels → Search → paste the feed URL. Or use
            a reader like Feedly or Reeder.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
