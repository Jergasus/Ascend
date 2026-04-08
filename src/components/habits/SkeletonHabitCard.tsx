export default function SkeletonHabitCard() {
  return (
    <div className="bg-white/5 rounded-2xl p-4 border-2 border-white/10 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        {/* Drag handle */}
        <div className="w-5 h-5 bg-white/10 rounded" />

        {/* Color bar */}
        <div className="h-12 w-1 bg-white/10 rounded-full" />

        <div className="flex-1">
          {/* Title */}
          <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
          {/* Category */}
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white/10 rounded" />
          <div className="w-9 h-9 bg-white/10 rounded" />
        </div>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(7)].map((_, idx) => (
          <div key={idx} className="aspect-square rounded-xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}
