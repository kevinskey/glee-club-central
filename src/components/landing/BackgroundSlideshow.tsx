
import React, { useState, useEffect } from "react";

interface BackgroundSlideshowProps {
  images: string[];
  duration?: number;
  transition?: number;
}

export function BackgroundSlideshow({
  images,
  duration = 7000,
  transition = 0,
}: BackgroundSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration);

    return () => clearInterval(intervalId);
  }, [images, duration]);

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${images[0]}')` }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${images[currentImageIndex]}')`,
        }}
      />
    </div>
  );
}
