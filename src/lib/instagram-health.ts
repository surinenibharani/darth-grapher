import "server-only";

const GRAPH_API = "https://graph.facebook.com/v21.0";

export interface InstagramHealthResult {
  ok: boolean;
  username?: string;
  pageLinked?: boolean;
  linkedInstagramId?: string;
  error?: string;
  hint?: string;
}

interface GraphError {
  message?: string;
  type?: string;
  code?: number;
}

function hintForError(message: string): string {
  if (/expired|session has expired/i.test(message)) {
    return "Token expired. In Graph API Explorer, generate a new User token, run GET /me/accounts, and copy the Page access_token (not the User token).";
  }
  if (/invalid oauth|cannot parse access token/i.test(message)) {
    return "Invalid token. Use the Page access_token from GET /me/accounts — not the token shown in the Explorer header.";
  }
  if (/permissions|does not exist/i.test(message)) {
    return "Missing permissions. Regenerate the token with instagram_basic, pages_show_list, and pages_read_engagement.";
  }
  return "Regenerate your Page access token via Graph API Explorer → GET /me/accounts.";
}

async function graphGet<T>(
  path: string,
  token: string
): Promise<{ ok: boolean; data?: T; error?: GraphError }> {
  const url = new URL(`${GRAPH_API}/${path}`);
  url.searchParams.set("access_token", token);

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  const data = await response.json();

  if (!response.ok) {
    return { ok: false, error: data?.error };
  }

  return { ok: true, data };
}

/** Server-side health check — verifies token, IG account, and optional Page link. */
export async function checkInstagramHealth(): Promise<InstagramHealthResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!token || !userId) {
    return {
      ok: false,
      error: "Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID.",
      hint: "Add these as server-side env vars only (never NEXT_PUBLIC_). Restart the dev server after updating .env.local.",
    };
  }

  const igAccount = await graphGet<{ id: string; username?: string }>(
    `${userId}?fields=id,username`,
    token
  );

  if (!igAccount.ok) {
    const message = igAccount.error?.message ?? "Instagram API request failed.";
    return {
      ok: false,
      error: message,
      hint: hintForError(message),
    };
  }

  const result: InstagramHealthResult = {
    ok: true,
    username: igAccount.data?.username,
  };

  if (!pageId) {
    result.hint =
      "Optional: set FACEBOOK_PAGE_ID to auto-verify your Facebook Page ↔ Instagram link when the feed breaks.";
    return result;
  }

  const page = await graphGet<{
    instagram_business_account?: { id: string; username?: string };
  }>(`${pageId}?fields=instagram_business_account{id,username}`, token);

  if (!page.ok) {
    return {
      ok: false,
      username: result.username,
      error: page.error?.message ?? "Could not verify Facebook Page.",
      hint: `Check FACEBOOK_PAGE_ID (${pageId}). Run GET /me/accounts in Graph API Explorer to confirm the correct Page id.`,
    };
  }

  const linkedId = page.data?.instagram_business_account?.id;
  result.linkedInstagramId = linkedId;
  result.pageLinked = linkedId === userId;

  if (!result.pageLinked) {
    return {
      ok: false,
      username: result.username,
      pageLinked: false,
      linkedInstagramId: linkedId,
      error: "Instagram account is not linked to this Facebook Page.",
      hint: linkedId
        ? `Page is linked to IG id ${linkedId}, but INSTAGRAM_USER_ID is ${userId}. Update INSTAGRAM_USER_ID or re-link accounts in Instagram → Settings → Accounts Center.`
        : "No Instagram account linked to this Facebook Page. Re-connect @darthgrapher to your Page in Instagram settings.",
    };
  }

  return result;
}
