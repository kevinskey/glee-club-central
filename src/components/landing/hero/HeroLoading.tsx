
import React from 'react';

export function HeroLoading() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary to-orange-500">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    </section>
  );
}
