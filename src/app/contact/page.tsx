import type { Metadata } from "next";
import ContactPageClient from "@/components/ContactPageClient";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Darth Grapher for prints, licensing, conservation partnerships, and wildlife photography collaborations.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
