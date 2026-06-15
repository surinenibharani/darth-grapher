const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website?: string;
}

export interface ContactValidationResult {
  ok: boolean;
  data?: ContactPayload;
  error?: string;
}

export function validateContactPayload(body: unknown): ContactValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.website === "string" && raw.website.trim()) {
    return { ok: false, error: "Unable to send message." };
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email =
    typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (name.length < 1 || name.length > 100) {
    return { ok: false, error: "Please enter your name (1–100 characters)." };
  }

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (message.length < 10 || message.length > 2000) {
    return {
      ok: false,
      error: "Message must be between 10 and 2,000 characters.",
    };
  }

  return { ok: true, data: { name, email, message } };
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
