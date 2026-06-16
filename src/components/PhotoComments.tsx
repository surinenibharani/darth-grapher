"use client";

import { useCallback, useEffect, useState } from "react";
import TurnstileWidget, {
  isTurnstileConfigured,
} from "@/components/TurnstileWidget";

interface PhotoComment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

interface PhotoCommentsProps {
  photoId: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function PhotoComments({ photoId }: PhotoCommentsProps) {
  const [comments, setComments] = useState<PhotoComment[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const captchaRequired = isTurnstileConfigured();

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken("");
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/photos/${encodeURIComponent(photoId)}/comments`
      );
      const data = await res.json();
      setComments(data.comments ?? []);
      setEnabled(data.enabled !== false);
    } catch {
      setComments([]);
    }
  }, [photoId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (captchaRequired && !captchaToken) {
      setStatus("error");
      setMessage("Please complete the security check.");
      return;
    }

    const form = e.currentTarget;
    const website = (form.elements.namedItem("website") as HTMLInputElement)
      ?.value;

    try {
      const res = await fetch(
        `/api/photos/${encodeURIComponent(photoId)}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            text,
            website,
            captchaToken: captchaToken || undefined,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not post comment.");
        setCaptchaToken("");
        setTurnstileKey((k) => k + 1);
        return;
      }

      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
      }
      setName("");
      setText("");
      setCaptchaToken("");
      setStatus("ok");
      setMessage("Comment posted.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again later.");
      setCaptchaToken("");
      setTurnstileKey((k) => k + 1);
    }
  }

  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
        Comments
      </p>

      {comments.length > 0 && (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-l border-gold/30 pl-4">
              <p className="font-sans text-xs uppercase tracking-widest text-ivory">
                {comment.name}
              </p>
              <p className="mt-1 font-sans text-sm leading-relaxed text-mist">
                {comment.text}
              </p>
              {comment.createdAt && (
                <p className="mt-1 font-sans text-[10px] text-mist/50">
                  {formatDate(comment.createdAt)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {enabled ? (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            maxLength={80}
            className="w-full border-b border-white/10 bg-transparent py-2 font-sans text-sm text-ivory outline-none transition-colors focus:border-gold"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts…"
            required
            rows={3}
            maxLength={500}
            className="w-full resize-none border-b border-white/10 bg-transparent py-2 font-sans text-sm text-ivory outline-none transition-colors focus:border-gold"
          />
          <TurnstileWidget
            key={turnstileKey}
            action="comment"
            onToken={setCaptchaToken}
            onExpire={handleCaptchaExpire}
          />
          <button
            type="submit"
            disabled={
              status === "loading" || (captchaRequired && !captchaToken)
            }
            className="border border-gold/60 px-4 py-2 font-sans text-xs uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-void disabled:opacity-50"
          >
            {status === "loading" ? "Posting…" : "Post Comment"}
          </button>
          {message && (
            <p
              className={`font-sans text-xs ${status === "error" ? "text-mist" : "text-gold"}`}
            >
              {message}
            </p>
          )}
        </form>
      ) : (
        <p className="mt-4 font-sans text-xs text-mist/60">
          Comments are not available right now.
        </p>
      )}
    </div>
  );
}
