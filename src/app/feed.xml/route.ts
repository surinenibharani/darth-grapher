import { getRecentPostsForFeed } from "@/lib/instagram-latest";

export const revalidate = 3600;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRssDate(iso: string): string | null {
  if (!iso) return null;
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toUTCString();
}

export async function GET() {
  const posts = await getRecentPostsForFeed(20);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://darth-grapher.vercel.app";

  const items = posts
    .map((post) => {
      const link = post.permalink || `${siteUrl}/portfolio`;
      const pubDate = formatRssDate(post.timestamp);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.description)}</description>
      ${pubDate ? `<pubDate>${escapeXml(pubDate)}</pubDate>` : ""}
      ${post.thumbnail ? `<enclosure url="${escapeXml(post.thumbnail)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Darth Grapher — Wildlife Photography</title>
    <link>${siteUrl}</link>
    <description>New wildlife photos from @darthgrapher</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
