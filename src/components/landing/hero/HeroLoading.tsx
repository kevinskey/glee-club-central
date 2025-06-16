
import React from 'react';

export function HeroLoading() {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4">
        <section className="relative md:h-[60vh] md:min-h-[400px] min-h-[200px] flex items-center justify-center bg-gradient-to-br from-primary to-orange-500 rounded-lg">
          <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
          <div className="relative z-10 text-center text-white py-8 md:py-0 px-10">
            <div className="animate-pulse text-sm sm:text-base">Loading...</div>
          </div>
        </section>
      </div>
    </div>
  );
}
