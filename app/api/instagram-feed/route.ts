export async function GET() {
    const igUserId = process.env.IG_USER_ID;
    const token = process.env.IG_ACCESS_TOKEN;
  
    if (!igUserId || !token) {
      return Response.json({ error: "Missing IG env vars" }, { status: 500 });
    }
  
    const url = new URL(`https://graph.facebook.com/v25.0/${igUserId}/media`);
    url.searchParams.set(
      "fields",
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
    );
    url.searchParams.set("limit", "12");
    url.searchParams.set("access_token", token);
  
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      return Response.json(data, { status: res.status });
    }
  
    return Response.json(data);
  }