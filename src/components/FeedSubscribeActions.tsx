"use client";

import { useState } from "react";

interface FeedSubscribeActionsProps {
  feedUrl: string;
}

export default function FeedSubscribeActions({
  feedUrl,
}: FeedSubscribeActionsProps) {
  const [copied, setCopied] = useState(false);
  const feedlyUrl = `https://feedly.com/i/subscription/feed/${encodeURIComponent(feedUrl)}`;

  async function copyFeedUrl() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="border border-white/5 bg-smoke/30 p-5">
        <p className="font-sans text-xs uppercase tracking-widest text-mist">
          Feed URL
        </p>
        <p className="mt-3 break-all font-mono text-sm text-ivory">{feedUrl}</p>
        <button
          type="button"
          onClick={copyFeedUrl}
          className="mt-4 border border-gold/60 px-5 py-2.5 font-sans text-xs uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-void"
        >
          {copied ? "Copied" : "Copy feed URL"}
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href={feedlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white/10 px-5 py-2.5 font-sans text-xs uppercase tracking-widest text-ivory transition-all hover:border-gold hover:text-gold"
        >
          Add to Feedly
        </a>
        <a
          href={feedUrl}
          className="border border-white/10 px-5 py-2.5 font-sans text-xs uppercase tracking-widest text-mist transition-all hover:border-gold hover:text-gold"
        >
          View raw feed
        </a>
      </div>
    </div>
  );
}
