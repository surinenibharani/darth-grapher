import { getLatestInstagramPost } from "@/lib/instagram-latest";
import {
  getSubscriberStore,
  updateLastNotifiedPostId,
} from "@/lib/notification-store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const latest = await getLatestInstagramPost();
  if (!latest) {
    return Response.json({ ok: true, message: "No posts to check" });
  }

  const store = await getSubscriberStore();
  if (store.lastNotifiedPostId === latest.id) {
    return Response.json({ ok: true, message: "No new posts" });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://darth-grapher.vercel.app";

  if (
    process.env.RESEND_API_KEY &&
    process.env.RESEND_FROM_EMAIL &&
    store.emails.length > 0
  ) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      bcc: store.emails,
      subject: `New post from Darth Grapher: ${latest.title}`,
      html: `
        <p>A new wildlife photo is live on @darthgrapher.</p>
        <p><strong>${latest.title}</strong></p>
        <p><a href="${latest.permalink || `${siteUrl}/portfolio`}">View the post</a></p>
        <p><a href="${siteUrl}">Visit the website</a></p>
      `,
    });
  }

  await updateLastNotifiedPostId(latest.id);

  return Response.json({
    ok: true,
    message: "Checked for new posts",
    postId: latest.id,
    notified: store.emails.length,
  });
}
