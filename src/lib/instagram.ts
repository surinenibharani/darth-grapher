import type { Photo, Species } from "@/data/photos";
import { birdGroupFromCaption } from "@/lib/bird-groups";

const GRAPH_API = "https://graph.facebook.com/v21.0";
const MEDIA_FIELDS =
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url,permalink}";

interface InstagramMediaNode {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: {
    data: InstagramMediaNode[];
  };
}

interface InstagramMediaResponse {
  data: InstagramMediaNode[];
  paging?: {
    next?: string;
  };
}

function titleFromCaption(caption: string): string {
  return caption.trim().split("\n")[0].trim();
}

function notesFromCaption(caption: string): string {
  const lines = caption
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const body: string[] = [];
  for (const line of lines.slice(1)) {
    if (line.startsWith("#")) break;
    body.push(line);
  }
  return body.join(" ");
}

function speciesFromCaption(caption: string): Species {
  const text = caption.toLowerCase();
  if (/(squirrel|goose|geese|deer|mammal)/.test(text)) return "mammals";
  if (/(fish|marine|ocean|tidal|shark)/.test(text)) return "marine";
  if (/(snake|turtle|reptile|frog|amphibian)/.test(text)) return "reptiles";
  return "birds";
}

function imageUrl(node: InstagramMediaNode): string | null {
  if (node.media_type === "IMAGE" && node.media_url) return node.media_url;
  if (node.media_type === "VIDEO" && node.thumbnail_url) return node.thumbnail_url;
  return null;
}

async function fetchMediaPage(url: string): Promise<InstagramMediaResponse> {
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Instagram Graph API error: ${error}`);
  }

  return response.json();
}

async function fetchAllMedia(userId: string, token: string): Promise<InstagramMediaNode[]> {
  let url = `${GRAPH_API}/${userId}/media?fields=${encodeURIComponent(MEDIA_FIELDS)}&limit=50&access_token=${token}`;
  const items: InstagramMediaNode[] = [];

  while (url && items.length < 100) {
    const page = await fetchMediaPage(url);
    items.push(...(page.data ?? []));
    url = page.paging?.next ?? "";
  }

  return items;
}

function flattenMedia(nodes: InstagramMediaNode[]): Array<{
  id: string;
  src: string;
  caption: string;
  permalink: string;
  timestamp: string;
}> {
  const flattened: Array<{
    id: string;
    src: string;
    caption: string;
    permalink: string;
    timestamp: string;
  }> = [];

  for (const node of nodes) {
    const caption = node.caption ?? "";
    const permalink = node.permalink ?? "";
    const timestamp = node.timestamp ?? "";

    if (node.media_type === "CAROUSEL_ALBUM" && node.children?.data?.length) {
      node.children.data.forEach((child, index) => {
        const src = imageUrl(child);
        if (!src) return;
        flattened.push({
          id: `${node.id}-${index}`,
          src,
          caption,
          permalink: child.permalink ?? permalink,
          timestamp,
        });
      });
      continue;
    }

    const src = imageUrl(node);
    if (!src) continue;

    flattened.push({
      id: node.id,
      src,
      caption,
      permalink,
      timestamp,
    });
  }

  return flattened;
}

export function isInstagramConfigured(): boolean {
  return Boolean(
    process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID
  );
}

export async function fetchInstagramPhotos(limit = 50): Promise<Photo[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    throw new Error("Instagram Graph API is not configured.");
  }

  const media = await fetchAllMedia(userId, token);
  const flattened = flattenMedia(media).slice(0, limit);

  return flattened.map((item, index) => {
    const caption = item.caption;
    const title = caption ? titleFromCaption(caption) : "Untitled";
    const notes = caption ? notesFromCaption(caption) : "";

    const species = caption ? speciesFromCaption(caption) : "birds";

    return {
      id: item.id,
      src: item.src,
      title,
      notes,
      location: "Pennsylvania",
      species,
      birdGroup:
        species === "birds" && caption
          ? birdGroupFromCaption(caption) ?? undefined
          : undefined,
      instagramUrl: item.permalink,
      featured: index < 5,
    };
  });
}
