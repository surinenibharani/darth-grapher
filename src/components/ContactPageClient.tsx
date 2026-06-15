"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <FadeIn>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
                Contact
              </p>
              <h1 className="mt-4 font-display text-5xl font-light text-ivory md:text-6xl">
                Let&apos;s Connect
              </h1>
              <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-mist">
                Interested in prints, licensing, or collaboration? Reach out —
                every inquiry is welcome.
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-12 space-y-8">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-mist">
                  Email
                </p>
                <a
                  href="mailto:darthgrapher@gmail.com"
                  className="mt-2 block font-display text-xl text-ivory transition-colors hover:text-gold"
                >
                  darthgrapher@gmail.com
                </a>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-mist">
                  Location
                </p>
                <p className="mt-2 font-display text-xl text-ivory">
                  Pennsylvania, USA
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-mist">
                  Availability
                </p>
                <p className="mt-2 font-sans text-sm text-mist">
                  Passionate hobbyist wildlife photographer open for conservation
                  partnerships and collaborations.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col items-center justify-center border border-white/5 bg-smoke/50 p-12 text-center"
              >
                <p className="font-display text-2xl text-ivory">Thank you</p>
                <p className="mt-4 font-sans text-sm text-mist">
                  Your message has been received. We&apos;ll be in touch soon.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-8 border border-white/5 bg-smoke/30 p-8 md:p-12"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="font-sans text-xs uppercase tracking-widest text-mist"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-3 w-full border-b border-white/10 bg-transparent py-3 font-sans text-sm text-ivory outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="font-sans text-xs uppercase tracking-widest text-mist"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-3 w-full border-b border-white/10 bg-transparent py-3 font-sans text-sm text-ivory outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="font-sans text-xs uppercase tracking-widest text-mist"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="mt-3 w-full resize-none border-b border-white/10 bg-transparent py-3 font-sans text-sm text-ivory outline-none transition-colors focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full border border-gold/60 py-4 font-sans text-xs uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-void"
                >
                  Send Message
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
