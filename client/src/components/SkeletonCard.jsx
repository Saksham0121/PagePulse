/** Skeleton shimmer placeholder for a metric card */
export default function SkeletonCard() {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="skeleton w-7 h-7 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <div className="skeleton w-24 h-3 rounded" />
            <div className="skeleton w-32 h-2 rounded" />
          </div>
        </div>
        <div className="skeleton w-14 h-5 rounded-full" />
      </div>
      {/* Value */}
      <div className="skeleton w-2/3 h-6 rounded" />
    </div>
  );
}
