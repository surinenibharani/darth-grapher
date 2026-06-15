export default function CollectionsLoading() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="animate-pulse">
          <div className="h-3 w-24 bg-smoke/60" />
          <div className="mt-4 h-14 w-80 max-w-full bg-smoke/60" />
          <div className="mt-6 h-4 w-full max-w-lg bg-smoke/40" />
        </div>
        <div className="mt-16 space-y-16">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i}>
              <div className="mb-6 h-8 w-40 animate-pulse bg-smoke/50" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {Array.from({ length: 8 }, (_, j) => (
                  <div
                    key={j}
                    className="aspect-square animate-pulse bg-smoke/60"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
