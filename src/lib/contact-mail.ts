import "server-only";

import { escapeHtml, type ContactPayload } from "@/lib/contact";

const DEFAULT_TO = "darthgrapher@gmail.com";

export async function sendContactEmail(
  payload: ContactPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? DEFAULT_TO;

  if (!apiKey || !from) {
    return {
      ok: false,
      error:
        "Contact form is not configured yet. Please try again later or reach out via Instagram @darthgrapher.",
    };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { name, email, message } = payload;

  const result = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Contact from ${name} — Darth Grapher`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (result.error) {
    console.error("[Contact] Resend error:", result.error);
    return { ok: false, error: "Could not send your message. Please try again." };
  }

  return { ok: true };
}
