
import React from "react";

interface SlideshowImageProps {
  src: string;
  isActive: boolean;
  transitionDuration: number;
}

export function SlideshowImage({ 
  src, 
  isActive, 
  transitionDuration 
}: SlideshowImageProps) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity"
      style={{
        backgroundImage: `url('${src}')`,
        opacity: isActive ? 1 : 0,
        transitionProperty: 'opacity',
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: 'ease',
      }}
    />
  );
}
