export async function POST(req: Request) {
    const { imageUrl, caption } = await req.json();
  
    const pageId = process.env.FB_PAGE_ID;
    const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;
  
    if (!pageId || !pageToken) {
      return Response.json({ error: "Missing Facebook env vars" }, { status: 500 });
    }
  
    const body = new URLSearchParams({
      url: imageUrl,
      caption: caption || "",
      published: "true",
      access_token: pageToken,
    });
  
    const res = await fetch(`https://graph.facebook.com/v25.0/${pageId}/photos`, {
      method: "POST",
      body,
    });
  
    const text = await res.text();
    return new Response(text, { status: res.status });
  }