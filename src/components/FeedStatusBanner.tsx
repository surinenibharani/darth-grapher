import { getInstagramFeedWarning } from "@/lib/photos";

export default async function FeedStatusBanner() {
  const message = await getInstagramFeedWarning();
  if (!message) return null;

  return (
    <div
      role="status"
      className="border-b border-gold/20 bg-gold/10 px-6 py-3 text-center lg:px-10"
    >
      <p className="font-sans text-xs leading-relaxed text-gold">{message}</p>
    </div>
  );
}
