
import React from "react";

interface SlideshowImageProps {
  src: string;
  isActive: boolean;
  transitionDuration: number;
  position?: string;
}

export function SlideshowImage({ 
  src, 
  isActive, 
  transitionDuration,
  position = "center" 
}: SlideshowImageProps) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-no-repeat transition-opacity"
      style={{
        backgroundImage: `url('${src}')`,
        backgroundPosition: position,
        opacity: isActive ? 1 : 0,
        transitionProperty: 'opacity',
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: 'ease',
      }}
    />
  );
}
