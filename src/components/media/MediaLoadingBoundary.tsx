
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface MediaLoadingBoundaryProps {
  children: React.ReactNode;
}

export function MediaLoadingBoundary({ children }: MediaLoadingBoundaryProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-glee-spelman" />
          <span className="text-lg text-gray-600">Loading media library...</span>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
