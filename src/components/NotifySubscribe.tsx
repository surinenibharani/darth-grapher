"use client";

import { useCallback, useEffect, useState } from "react";
import TurnstileWidget, {
  isTurnstileConfigured,
} from "@/components/TurnstileWidget";

const STORAGE_KEY = "dg-notify-enabled";
const LAST_POST_KEY = "dg-last-post-id";
const POLL_MS = 30 * 60 * 1000;

interface NotifySubscribeProps {
  /** Server-rendered latest post id — avoids an extra client fetch on page load. */
  latestPostId?: string | null;
}

interface LatestPost {
  id: string;
  title: string;
  permalink: string;
  thumbnail: string;
}

export default function NotifySubscribe({
  latestPostId = null,
}: NotifySubscribeProps) {
  const [browserEnabled, setBrowserEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const [browserStatus, setBrowserStatus] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const captchaRequired = isTurnstileConfigured();

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken("");
  }, []);

  const checkForNewPost = useCallback(async (showNotification: boolean) => {
    try {
      const res = await fetch("/api/instagram/latest");
      const data = await res.json();
      const post: LatestPost | null = data.post;

      if (!post?.id) return;

      const lastSeen = localStorage.getItem(LAST_POST_KEY);

      if (!lastSeen) {
        localStorage.setItem(LAST_POST_KEY, post.id);
        return;
      }

      if (lastSeen !== post.id && showNotification && Notification.permission === "granted") {
        new Notification("New post from Darth Grapher", {
          body: post.title,
          icon: post.thumbnail || "/images/about-tree-swallow.jpg",
          tag: "darthgrapher-new-post",
          data: { url: post.permalink || "/portfolio" },
        });
      }

      localStorage.setItem(LAST_POST_KEY, post.id);
    } catch {
      // silently retry on next poll
    }
  }, []);

  useEffect(() => {
    const enabled = localStorage.getItem(STORAGE_KEY) === "true";
    setBrowserEnabled(enabled);

    if (latestPostId && !localStorage.getItem(LAST_POST_KEY)) {
      localStorage.setItem(LAST_POST_KEY, latestPostId);
    }

    if (enabled && Notification.permission === "granted") {
      checkForNewPost(true);
      const interval = setInterval(() => checkForNewPost(true), POLL_MS);
      return () => clearInterval(interval);
    }
  }, [checkForNewPost, latestPostId]);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // optional — browser notifications still work from the page
    });
  }, []);

  async function enableBrowserNotifications() {
    if (!("Notification" in window)) {
      setBrowserStatus("Your browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setBrowserStatus("Notifications blocked. Enable them in your browser settings.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, "true");
    setBrowserEnabled(true);
    setBrowserStatus("You will be notified when a new post goes live.");
    await checkForNewPost(false);
  }

  function disableBrowserNotifications() {
    localStorage.removeItem(STORAGE_KEY);
    setBrowserEnabled(false);
    setBrowserStatus("Browser notifications turned off.");
  }

  async function subscribeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus("loading");
    setEmailMessage("");

    if (captchaRequired && !captchaToken) {
      setEmailStatus("error");
      setEmailMessage("Please complete the security check.");
      return;
    }

    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken: captchaToken || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEmailStatus("error");
        setEmailMessage(data.error ?? "Could not subscribe.");
        setCaptchaToken("");
        setTurnstileKey((k) => k + 1);
        return;
      }

      setEmailStatus("ok");
      setEmailMessage(data.message);
      setEmail("");
      setCaptchaToken("");
    } catch {
      setEmailStatus("error");
      setEmailMessage("Something went wrong. Try again later.");
      setCaptchaToken("");
      setTurnstileKey((k) => k + 1);
    }
  }

  return (
    <div className="border-t border-white/5 bg-smoke/30 px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
          Stay Updated
        </p>
        <h2 className="mt-3 font-display text-2xl font-light text-ivory md:text-3xl">
          Get notified of new posts
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-mist">
          Choose how you want to hear about new wildlife photos from @darthgrapher.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="border border-white/5 p-6">
            <p className="font-sans text-xs uppercase tracking-widest text-gold">
              Browser
            </p>
            <p className="mt-3 font-sans text-sm text-mist">
              Instant alerts on this device when a new post is published.
            </p>
            {browserEnabled ? (
              <button
                type="button"
                onClick={disableBrowserNotifications}
                className="mt-6 border border-white/10 px-5 py-2.5 font-sans text-xs uppercase tracking-widest text-mist transition-colors hover:border-gold hover:text-gold"
              >
                Turn Off
              </button>
            ) : (
              <button
                type="button"
                onClick={enableBrowserNotifications}
                className="mt-6 border border-gold/60 px-5 py-2.5 font-sans text-xs uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-void"
              >
                Enable Notifications
              </button>
            )}
            {browserStatus && (
              <p className="mt-3 font-sans text-xs text-mist">{browserStatus}</p>
            )}
          </div>

          <div className="border border-white/5 p-6">
            <p className="font-sans text-xs uppercase tracking-widest text-gold">
              Email
            </p>
            <p className="mt-3 font-sans text-sm text-mist">
              Receive an email whenever a new post goes live.
            </p>
            <form onSubmit={subscribeEmail} className="mt-6 space-y-3">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="pointer-events-none absolute h-0 w-0 opacity-0"
                aria-hidden
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border-b border-white/10 bg-transparent py-2 font-sans text-sm text-ivory outline-none transition-colors focus:border-gold"
              />
              <TurnstileWidget
                key={turnstileKey}
                action="subscribe"
                onToken={setCaptchaToken}
                onExpire={handleCaptchaExpire}
              />
              <button
                type="submit"
                disabled={
                  emailStatus === "loading" ||
                  (captchaRequired && !captchaToken)
                }
                className="border border-gold/60 px-5 py-2.5 font-sans text-xs uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-void disabled:opacity-50"
              >
                {emailStatus === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            {emailMessage && (
              <p
                className={`mt-3 font-sans text-xs ${emailStatus === "error" ? "text-mist" : "text-gold"}`}
              >
                {emailMessage}
              </p>
            )}
          </div>

          <div className="border border-white/5 p-6">
            <p className="font-sans text-xs uppercase tracking-widest text-gold">
              RSS Feed
            </p>
            <p className="mt-3 font-sans text-sm text-mist">
              Add the feed to Feedly, Apple News, or any RSS reader — no account
              needed.
            </p>
            <a
              href="/feed"
              className="mt-6 inline-block border border-white/10 px-5 py-2.5 font-sans text-xs uppercase tracking-widest text-ivory transition-all hover:border-gold hover:text-gold"
            >
              Subscribe via RSS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
