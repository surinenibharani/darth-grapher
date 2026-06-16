/** Patterns for common scripted clients and scrapers (not search engine crawlers). */
const BLOCKED_UA_PATTERNS = [
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /python-urllib/i,
  /aiohttp\//i,
  /scrapy\//i,
  /go-http-client/i,
  /java\//i,
  /libwww-perl/i,
  /okhttp\//i,
  /httpclient\//i,
  /postmanruntime/i,
  /insomnia\//i,
  /headlesschrome/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
];

const PROTECTED_POST_PATHS = [
  "/api/contact",
  "/api/notifications/subscribe",
];

export function getClientIp(req: Request): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined
  );
}

export function isProtectedFormPost(pathname: string, method: string): boolean {
  if (method !== "POST") return false;
  if (PROTECTED_POST_PATHS.includes(pathname)) return true;
  return /^\/api\/photos\/[^/]+\/comments$/.test(pathname);
}

/** Block obvious non-browser automated clients on public form endpoints. */
export function isLikelyAutomatedBot(req: Request): boolean {
  const ua = req.headers.get("user-agent")?.trim() ?? "";

  if (!ua || ua.length < 10) return true;

  if (BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(ua))) {
    return true;
  }

  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("application/json") && !accept.includes("*/*")) {
    return true;
  }

  return false;
}

export function botChallengeResponse(): Response {
  return Response.json(
    { error: "Request blocked. Please use the form in your browser." },
    { status: 403 }
  );
}
