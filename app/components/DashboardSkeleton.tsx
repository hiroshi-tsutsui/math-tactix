import Skeleton from './Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-16">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-200 pb-12">
        <div className="space-y-4 w-1/2">
          <Skeleton variant="text" height="4rem" width="80%" />
          <Skeleton variant="text" width="60%" />
        </div>
        <div className="w-full md:w-80 h-64">
           <Skeleton variant="rect" height="100%" className="rounded-[32px]" />
        </div>
      </div>

      {/* Sections Skeleton */}
      {[1, 2, 3].map((s) => (
        <div key={s} className="space-y-6">
          <Skeleton variant="text" width="200px" height="2rem" />
          <Skeleton variant="text" width="400px" className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((c) => (
              <Skeleton key={c} variant="rect" height="300px" className="rounded-[40px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
