import "server-only";

const STORAGE_PATH = "notification-subscribers.json";

interface SubscriberStore {
  emails: string[];
  lastNotifiedPostId: string | null;
}

function emptyStore(): SubscriberStore {
  return { emails: [], lastNotifiedPostId: null };
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

export async function addEmailSubscriber(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  const hasResend = Boolean(
    process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID
  );
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (!hasResend && !hasBlob) return false;

  if (hasResend) {
    const res = await fetch(
      `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalized,
          unsubscribed: false,
        }),
      }
    );
    if (!res.ok && res.status !== 409) {
      console.error("[Notify] Resend contact error:", await res.text());
      if (!hasBlob) return false;
    }
  }

  if (hasBlob) {
    const store = await readStore();
    if (!store.emails.includes(normalized)) {
      store.emails.push(normalized);
      await writeStore(store);
    }
  }

  return true;
}

export async function getSubscriberStore(): Promise<SubscriberStore> {
  return readStore();
}

export async function updateLastNotifiedPostId(postId: string): Promise<void> {
  const store = await readStore();
  store.lastNotifiedPostId = postId;
  await writeStore(store);
}
