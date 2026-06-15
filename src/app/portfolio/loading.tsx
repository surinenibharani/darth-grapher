import PhotoGridSkeleton from "@/components/PhotoGridSkeleton";

export default function PortfolioLoading() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="animate-pulse">
          <div className="h-3 w-20 bg-smoke/60" />
          <div className="mt-4 h-14 w-72 max-w-full bg-smoke/60" />
          <div className="mt-6 h-4 w-full max-w-xl bg-smoke/40" />
        </div>

        <div className="mt-16 space-y-6">
          <div className="h-12 animate-pulse border border-white/5 bg-smoke/30" />
          <PhotoGridSkeleton />
        </div>
      </div>
    </div>
  );
}
