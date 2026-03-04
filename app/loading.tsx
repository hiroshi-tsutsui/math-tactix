"use client";

import Skeleton from './components/Skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton variant="text" width="200px" height="2rem" />
        <Skeleton variant="circle" />
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <Skeleton variant="text" width="60%" className="mb-4" />
        <Skeleton variant="text" width="80%" className="mb-2" />
        <Skeleton variant="rect" height="150px" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <Skeleton variant="text" width="70%" className="mb-4" />
            <Skeleton variant="rect" height="100px" />
            <div className="mt-4 flex justify-between">
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="20%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
