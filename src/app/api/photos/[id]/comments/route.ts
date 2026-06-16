import {
  addComment,
  getCommentsForPhoto,
  isCommentsStorageConfigured,
} from "@/lib/comments-store";
import { enforceCaptcha } from "@/lib/require-captcha";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const comments = await getCommentsForPhoto(decodeURIComponent(id));

  return Response.json({
    comments,
    enabled: isCommentsStorageConfigured(),
  });
}

export async function POST(req: Request, context: RouteContext) {
  if (!isCommentsStorageConfigured()) {
    return Response.json(
      { error: "Comments are not configured for this deployment." },
      { status: 503 }
    );
  }

  const { id } = await context.params;
  const photoId = decodeURIComponent(id);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const captchaError = await enforceCaptcha(req, body, "comment");
  if (captchaError) return captchaError;

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 500) : "";

  if (!name || name.length < 2) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }

  if (!text || text.length < 2) {
    return Response.json({ error: "Please write a comment." }, { status: 400 });
  }

  const comment = await addComment(photoId, name, text);
  if (!comment) {
    return Response.json(
      { error: "Could not save your comment. Try again later." },
      { status: 503 }
    );
  }

  return Response.json({ ok: true, comment });
}
