
import React from 'react';

export function HeroLoadingState() {
  return (
    <section className="w-full">
      <div className="w-full">
        <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/5 dark:to-primary/15 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-2xl md:text-3xl font-bold text-primary animate-pulse">
                The Glee Club is loading...........
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
