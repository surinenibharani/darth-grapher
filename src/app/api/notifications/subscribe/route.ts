import { addEmailSubscriber } from "@/lib/notification-store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  const stored = await addEmailSubscriber(email);

  if (!stored) {
    return Response.json(
      {
        error:
          "Email notifications are not configured yet. Use browser notifications or RSS instead.",
      },
      { status: 503 }
    );
  }

  return Response.json({
    ok: true,
    message: "You will be emailed when a new post goes live.",
  });
}
