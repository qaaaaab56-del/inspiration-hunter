export function Skeleton() {
  return (
    <div className="animate-pulse-soft space-y-4 px-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-stone-100">
          <div className="h-4 bg-stone-100 rounded w-3/4 mb-3" />
          <div className="h-3 bg-stone-50 rounded w-full mb-2" />
          <div className="h-3 bg-stone-50 rounded w-2/3" />
          <div className="flex gap-2 mt-4">
            <div className="h-5 bg-stone-50 rounded-full w-12" />
            <div className="h-5 bg-stone-50 rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
