import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";

export default function ContactCTA() {
  return (
    <section className="border-t border-white/5 bg-smoke/20 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          <FadeIn>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">
              Get in Touch
            </p>
            <h2 className="mt-4 font-display text-4xl font-light text-ivory md:text-5xl">
              Start a conversation
            </h2>
            <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-mist">
              Prints, licensing, or a conservation partnership — send a quick
              note and we&apos;ll reply by email.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ContactForm variant="compact" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
