"use client";

import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";

export default function ContactPageClient() {
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
                Interested in prints, licensing, or collaboration? Send a message
                — every inquiry is welcome.
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-12 space-y-8">
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
            <ContactForm variant="full" />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
