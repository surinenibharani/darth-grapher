import { sendContactEmail } from "@/lib/contact-mail";
import { validateContactPayload } from "@/lib/contact";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
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
