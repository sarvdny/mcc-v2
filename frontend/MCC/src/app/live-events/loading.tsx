'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/shared/Skeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5 animate-in fade-in duration-150">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <Skeleton className="h-6 w-80 rounded-lg" />
            <Skeleton variant="subtle" className="h-4 w-96 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>

        {/* Video stream cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
              <Skeleton className="h-64 w-full rounded-xl" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-48 rounded" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton variant="subtle" className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
