"use client";

import Script from "next/script";
import { useEffect } from "react";

interface ElfsightInstagramFeedProps {
  widgetId: string;
  className?: string;
}

export default function ElfsightInstagramFeed({
  widgetId,
  className = "",
}: ElfsightInstagramFeedProps) {
  useEffect(() => {
    // Elfsight mounts client-side; re-init if navigating via Next.js
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [widgetId]);

  return (
    <div className={className}>
      <div className={`elfsight-app-${widgetId}`} data-elfsight-app-lazy />
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
