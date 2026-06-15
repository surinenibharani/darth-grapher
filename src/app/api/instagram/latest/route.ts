import { getLatestInstagramPost } from "@/lib/instagram-latest";

export const dynamic = "force-dynamic";

export async function GET() {
  const latest = await getLatestInstagramPost();

  if (!latest) {
    return Response.json({ post: null }, { status: 200 });
  }

  return Response.json(
    { post: latest },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
