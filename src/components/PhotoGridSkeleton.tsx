const aspects = [
  "aspect-[4/3]",
  "aspect-[2/3]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[2/3]",
];

export default function PhotoGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="mb-4 break-inside-avoid">
          <div
            className={`${aspects[i % aspects.length]} animate-pulse bg-smoke/60`}
          />
        </div>
      ))}
    </div>
  );
}
