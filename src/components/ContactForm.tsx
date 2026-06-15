"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ContactFormProps {
  variant?: "full" | "compact";
  className?: string;
}

export default function ContactForm({
  variant = "full",
  className = "",
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Could not send message.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border border-white/5 bg-smoke/50 p-8 text-center md:p-10 ${className}`}
      >
        <p className="font-display text-2xl text-ivory">Thank you</p>
        <p className="mt-3 font-sans text-sm text-mist">
          Your message has been sent. We&apos;ll be in touch soon.
        </p>
      </motion.div>
    );
  }

  const isCompact = variant === "compact";
  const inputClass =
    "mt-2 w-full border-b border-white/10 bg-transparent py-2.5 font-sans text-sm text-ivory outline-none transition-colors focus:border-gold";
  const labelClass = "font-sans text-xs uppercase tracking-widest text-mist";

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 border border-white/5 bg-smoke/30 p-6 md:p-8 ${className}`}
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        aria-hidden
      />

      <div>
        <label htmlFor={`contact-name-${variant}`} className={labelClass}>
          Name
        </label>
        <input
          id={`contact-name-${variant}`}
          name="name"
          type="text"
          required
          maxLength={100}
          disabled={status === "loading"}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`contact-email-${variant}`} className={labelClass}>
          Email
        </label>
        <input
          id={`contact-email-${variant}`}
          name="email"
          type="email"
          required
          disabled={status === "loading"}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`contact-message-${variant}`} className={labelClass}>
          Message
        </label>
        <textarea
          id={`contact-message-${variant}`}
          name="message"
          rows={isCompact ? 3 : 5}
          required
          minLength={10}
          maxLength={2000}
          disabled={status === "loading"}
          className={`${inputClass} resize-none`}
        />
      </div>

      {errorMessage && (
        <p className="font-sans text-xs text-mist">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={`w-full border border-gold/60 py-3 font-sans text-xs uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-void disabled:opacity-50 ${
          isCompact ? "" : "py-4"
        }`}
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
