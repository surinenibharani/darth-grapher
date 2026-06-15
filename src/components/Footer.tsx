import Link from "next/link";
import NotifySubscribe from "@/components/NotifySubscribe";
import { getLatestInstagramPost } from "@/lib/instagram-latest";

export default async function Footer() {
  const latest = await getLatestInstagramPost();

  return (
    <footer className="border-t border-white/5 bg-charcoal">
      <NotifySubscribe latestPostId={latest?.id ?? null} />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row lg:px-10">
        <p className="font-display text-2xl tracking-logo">
          <span className="text-forest">DARTH</span>{" "}
          <span className="text-gold">GRAPHER</span>
        </p>
        <p className="font-sans text-xs uppercase tracking-widest text-mist">
          Wildlife Photography
        </p>
        <div className="flex gap-8">
          <Link
            href="/portfolio"
            className="font-sans text-xs uppercase tracking-widest text-mist transition-colors hover:text-gold"
          >
            Portfolio
          </Link>
          <Link
            href="/videos"
            className="font-sans text-xs uppercase tracking-widest text-mist transition-colors hover:text-gold"
          >
            Videos
          </Link>
          <Link
            href="/contact"
            className="font-sans text-xs uppercase tracking-widest text-mist transition-colors hover:text-gold"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center">
        <p className="font-sans text-xs text-mist/60">
          &copy; {new Date().getFullYear()} Darth Grapher. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
