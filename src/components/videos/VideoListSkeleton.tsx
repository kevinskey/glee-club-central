
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function VideoListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Video player skeleton */}
      <div className="lg:col-span-2">
        <div className="rounded-lg border">
          <div className="p-4 md:p-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
          <Skeleton className="aspect-video w-full" />
        </div>
      </div>
      
      {/* Sidebar skeleton */}
      <div className="space-y-4 lg:col-span-1">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-2 rounded-lg border p-2">
              <Skeleton className="aspect-video h-16 w-24" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1 h-3 w-20" />
                <Skeleton className="mt-1 h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
