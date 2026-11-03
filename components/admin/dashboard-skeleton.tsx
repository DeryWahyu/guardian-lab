export function DashboardSkeleton() {
  return (
    <output className="block space-y-8" aria-label="Memuat dashboard admin">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200 motion-reduce:animate-none" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-slate-100 motion-reduce:animate-none"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100 motion-reduce:animate-none" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100 motion-reduce:animate-none" />
      </div>
    </output>
  );
}
