
import React from 'react';

export function HeroLoading() {
  return (
    <section className="relative h-[40vh] sm:h-[60vh] md:h-[70vh] min-h-[300px] sm:min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary to-orange-500">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center text-white">
        <div className="animate-pulse text-sm sm:text-base">Loading...</div>
      </div>
    </section>
  );
}
