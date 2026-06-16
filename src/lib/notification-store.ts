import "server-only";

const STORAGE_PATH = "notification-subscribers.json";

interface SubscriberStore {
  emails: string[];
  lastNotifiedPostId: string | null;
}

function emptyStore(): SubscriberStore {
  return { emails: [], lastNotifiedPostId: null };
}

export function isEmailSubscribeEnabled(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID)
  );
}

async function readStore(): Promise<SubscriberStore> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return emptyStore();

  try {
    const { head } = await import("@vercel/blob");
    const meta = await head(STORAGE_PATH);
    const res = await fetch(meta.url);
    if (!res.ok) return emptyStore();
    return (await res.json()) as SubscriberStore;
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: SubscriberStore): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  const { put } = await import("@vercel/blob");
  await put(STORAGE_PATH, JSON.stringify(store), {
    access: "private",
    allowOverwrite: true,
  });
}

async function fetchResendAudienceEmails(): Promise<string[]> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return [];

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    if (!res.ok) {
      console.error("[Notify] Resend list contacts error:", await res.text());
      return [];
    }
    const data = (await res.json()) as { data?: Array<{ email?: string }> };
    return (data.data ?? [])
      .map((contact) => contact.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email));
  } catch (error) {
    console.error("[Notify] Resend list contacts failed:", error);
    return [];
  }
}

async function addToResendAudience(email: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return false;

  const res = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    }
  );

  if (res.ok || res.status === 409) return true;

  console.error("[Notify] Resend contact error:", await res.text());
  return false;
}

export async function addEmailSubscriber(email: string): Promise<boolean> {
  if (!isEmailSubscribeEnabled()) return false;

  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  let saved = false;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const store = await readStore();
    if (!store.emails.includes(normalized)) {
      store.emails.push(normalized);
      await writeStore(store);
    }
    saved = true;
  }

  if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
    const resendOk = await addToResendAudience(normalized);
    saved = saved || resendOk;
  }

  return saved;
}

/** All subscriber emails from Blob and/or Resend audience. */
export async function getSubscriberEmails(): Promise<string[]> {
  const store = await readStore();
  const resendEmails = await fetchResendAudienceEmails();
  return Array.from(new Set([...store.emails, ...resendEmails]));
}

export async function getSubscriberStore(): Promise<SubscriberStore> {
  return readStore();
}

export async function updateLastNotifiedPostId(postId: string): Promise<void> {
  const store = await readStore();
  store.lastNotifiedPostId = postId;
  await writeStore(store);
}
