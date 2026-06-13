"use client";

import { useEffect, useState } from "react";

type IGItem = {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

export default function InstagramGrid() {
  const [items, setItems] = useState<IGItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/instagram-feed");
      const json = await res.json();
      setItems(json.data || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div>Loading Instagram posts…</div>;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {items.map((item) => {
        const src = item.media_url || item.thumbnail_url || "";
        return (
          <a
            key={item.id}
            href={item.permalink}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-xl border"
          >
            {src ? (
              <img src={src} alt={item.caption || "Instagram post"} className="h-64 w-full object-cover" />
            ) : null}
          </a>
        );
      })}
    </div>
  );
}