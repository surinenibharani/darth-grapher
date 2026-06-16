import "server-only";

import type { CaptchaAction } from "@/lib/captcha-types";
import { getClientIp } from "@/lib/bot-guard";
import { isTurnstileEnabled, verifyTurnstileToken } from "@/lib/turnstile";

export type { CaptchaAction };

export async function enforceCaptcha(
  req: Request,
  body: Record<string, unknown>,
  action: CaptchaAction
): Promise<Response | null> {
  if (typeof body.website === "string" && body.website.trim()) {
    return Response.json({ error: "Unable to process request." }, { status: 400 });
  }

  if (!isTurnstileEnabled()) return null;

  const captchaToken =
    typeof body.captchaToken === "string" ? body.captchaToken.trim() : "";

  if (!captchaToken) {
    return Response.json(
      { error: "Please complete the security check." },
      { status: 400 }
    );
  }

  const result = await verifyTurnstileToken(
    captchaToken,
    getClientIp(req),
    action
  );

  if (!result.ok) {
    return Response.json(
      { error: "Security check failed. Please try again." },
      { status: 400 }
    );
  }

  return null;
}
