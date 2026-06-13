/**
 * Server-side Instagram health check.
 * Run: npm run check:instagram
 *
 * Tokens are read from .env.local and never printed.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return {};

  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return vars;
}

async function graphGet(path, token) {
  const url = new URL(`https://graph.facebook.com/v21.0/${path}`);
  url.searchParams.set("access_token", token);
  const res = await fetch(url.toString());
  return res.json();
}

const env = { ...process.env, ...loadEnvLocal() };
const token = env.INSTAGRAM_ACCESS_TOKEN;
const userId = env.INSTAGRAM_USER_ID;
const pageId = env.FACEBOOK_PAGE_ID;

console.log("Instagram feed diagnostic\n");

if (!token || !userId) {
  console.log("FAIL: Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID in .env.local");
  process.exit(1);
}

const ig = await graphGet(`${userId}?fields=id,username`, token);

if (ig.error) {
  console.log("FAIL: Token / IG account");
  console.log("  Error:", ig.error.message);
  process.exit(1);
}

console.log("OK: Token valid");
console.log("  Instagram:", `@${ig.username ?? "unknown"} (${ig.id})`);

if (pageId) {
  const page = await graphGet(
    `${pageId}?fields=instagram_business_account{id,username}`,
    token
  );

  if (page.error) {
    console.log("FAIL: Facebook Page check");
    console.log("  Error:", page.error.message);
    console.log("  Hint: Verify FACEBOOK_PAGE_ID via GET /me/accounts");
    process.exit(1);
  }

  const linkedId = page.instagram_business_account?.id;
  if (linkedId === userId) {
    console.log("OK: Facebook Page linked to Instagram");
    console.log("  Page id:", pageId);
  } else {
    console.log("FAIL: Page ↔ Instagram mismatch");
    console.log("  FACEBOOK_PAGE_ID:", pageId);
    console.log("  Page linked IG id:", linkedId ?? "none");
    console.log("  INSTAGRAM_USER_ID:", userId);
    console.log("  Hint: Re-link in Instagram → Settings → Accounts Center");
    process.exit(1);
  }
} else {
  console.log("SKIP: FACEBOOK_PAGE_ID not set (optional Page link check)");
}

const media = await graphGet(
  `${userId}/media?fields=id,media_type&limit=5`,
  token
);

if (media.error) {
  console.log("FAIL: Could not fetch media");
  console.log("  Error:", media.error.message);
  process.exit(1);
}

const videos = (media.data ?? []).filter((p) => p.media_type === "VIDEO").length;
console.log(`OK: Fetched ${media.data?.length ?? 0} recent posts (${videos} videos)`);
console.log("\nAll checks passed.");
