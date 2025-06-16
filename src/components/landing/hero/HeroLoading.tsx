
import React from 'react';

export function HeroLoading() {
  return (
    <section className="relative w-full h-[40vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-orange-500">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center text-white py-8 md:py-0 px-10">
        <div className="animate-pulse text-sm sm:text-base">Loading...</div>
      </div>
    </section>
  );
}
