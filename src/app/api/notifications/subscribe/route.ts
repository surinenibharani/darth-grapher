import { addEmailSubscriber, isEmailSubscribeEnabled } from "@/lib/notification-store";
import { enforceCaptcha } from "@/lib/require-captcha";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const captchaError = await enforceCaptcha(req, body, "subscribe");
  if (captchaError) return captchaError;

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!isEmailSubscribeEnabled()) {
    return Response.json(
      {
        error:
          "Email signup is not enabled on the server yet. Try browser notifications or RSS, or check back soon.",
      },
      { status: 503 }
    );
  }

  const stored = await addEmailSubscriber(email);

  if (!stored) {
    return Response.json(
      { error: "Could not save your subscription. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    message: "You will be emailed when a new post goes live.",
  });
}
