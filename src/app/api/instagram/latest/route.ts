import { getLatestInstagramPost } from "@/lib/instagram-latest";

export const revalidate = 900;

export async function GET() {
  const latest = await getLatestInstagramPost();

  if (!latest) {
    return Response.json({ post: null }, { status: 200 });
  }

  return Response.json(
    { post: latest },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    }
  );
}
