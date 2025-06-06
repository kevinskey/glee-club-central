
import React from 'react';

export function NewsTickerLoading() {
  return (
    <div className="bg-gradient-to-r from-glee-columbia via-glee-purple to-glee-columbia text-white py-3 w-full overflow-hidden border-b border-white/10">
      <div className="w-full px-4 flex items-center justify-center">
        <div className="animate-pulse text-white drop-shadow-sm font-bold text-xs">
          <span className="inline-flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Loading latest news...
          </span>
        </div>
      </div>
    </div>
  );
}
