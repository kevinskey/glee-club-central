
import React from 'react';

export function HeroDefaultState() {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-full md:max-w-3xl lg:max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] bg-gradient-to-br from-glee-spelman to-glee-spelman/90 overflow-hidden flex items-center justify-center rounded-lg">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative h-full flex items-center justify-center text-center px-4 z-10">
            <div className="max-w-4xl mx-auto text-white space-y-3 sm:space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Welcome to Glee World
              </h1>
              <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                The official hub for Spelman College Glee Club
              </p>
              <p className="text-sm sm:text-base italic opacity-80">
                "To Amaze and Inspire"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
