
import React from 'react';

export function HeroLoadingState() {
  return (
    <div className="w-full">
      <div className="relative w-full h-[280px] sm:h-[400px] md:h-[550px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
            Loading hero...
          </div>
        </div>
      </div>
    </div>
  );
}
