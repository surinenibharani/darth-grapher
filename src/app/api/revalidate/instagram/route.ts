import { revalidateTag } from "next/cache";
import { INSTAGRAM_CACHE_TAG } from "@/lib/instagram-feed";

export const dynamic = "force-dynamic";

function isAuthorized(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

/** On-demand cache bust for the Instagram feed (cron or manual). */
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(INSTAGRAM_CACHE_TAG);

  return Response.json({
    ok: true,
    revalidated: true,
    tag: INSTAGRAM_CACHE_TAG,
    revalidateSeconds: 3600,
  });
}
