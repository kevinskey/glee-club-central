
import React from 'react';

export function HeroLoading() {
  return (
    <section className="hero-section relative w-full min-h-[80vh] sm:min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-orange-500">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center text-white py-4 px-2">
        <div className="animate-pulse text-sm sm:text-base">Loading...</div>
      </div>
    </section>
  );
}
