import {
  botChallengeResponse,
  isLikelyAutomatedBot,
  isProtectedFormPost,
} from "@/lib/bot-guard";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isProtectedFormPost(pathname, req.method)) {
    if (isLikelyAutomatedBot(req)) {
      return botChallengeResponse();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/contact",
    "/api/notifications/subscribe",
    "/api/photos/:path*/comments",
  ],
};
