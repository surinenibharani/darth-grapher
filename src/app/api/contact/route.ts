import { sendContactEmail } from "@/lib/contact-mail";
import { validateContactPayload } from "@/lib/contact";
import { isTurnstileEnabled, verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (isTurnstileEnabled()) {
    const raw = body as Record<string, unknown>;
    const captchaToken =
      typeof raw.captchaToken === "string" ? raw.captchaToken.trim() : "";

    if (!captchaToken) {
      return Response.json(
        { error: "Please complete the captcha check." },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip");

    const valid = await verifyTurnstileToken(captchaToken, ip);
    if (!valid) {
      return Response.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 400 }
      );
    }
  }

  const validation = validateContactPayload(body);
  if (!validation.ok || !validation.data) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const result = await sendContactEmail(validation.data);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 503 });
  }

  return Response.json({
    ok: true,
    message: "Thank you — your message has been sent.",
  });
}
