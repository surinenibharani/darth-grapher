import "server-only";

import type { CaptchaAction } from "@/lib/captcha-types";

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
}

export interface TurnstileVerifyResult {
  ok: boolean;
  errorCodes?: string[];
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null,
  expectedAction?: CaptchaAction
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false, errorCodes: ["not-configured"] };

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) return { ok: false, errorCodes: ["verify-http-error"] };

    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
      action?: string;
      hostname?: string;
    };

    if (!data.success) {
      return { ok: false, errorCodes: data["error-codes"] };
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return { ok: false, errorCodes: ["action-mismatch"] };
    }

    const allowedHost = process.env.TURNSTILE_ALLOWED_HOSTNAME;
    if (
      allowedHost &&
      data.hostname &&
      data.hostname !== allowedHost &&
      !data.hostname.endsWith(`.${allowedHost}`)
    ) {
      return { ok: false, errorCodes: ["hostname-mismatch"] };
    }

    return { ok: true };
  } catch (error) {
    console.error("[Turnstile] Verification failed:", error);
    return { ok: false, errorCodes: ["verify-exception"] };
  }
}
