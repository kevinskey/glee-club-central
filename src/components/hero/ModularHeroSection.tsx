
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MediaFile } from '@/types/media';

interface ModularHeroSectionProps {
  category: string;
  displayMode?: 'single' | 'slideshow';
  showOverlay?: boolean;
  overlayTitle?: string;
  overlaySubtitle?: string;
  height?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function ModularHeroSection({
  category,
  displayMode = 'slideshow',
  showOverlay = true,
  overlayTitle,
  overlaySubtitle,
  height = '60vh',
  autoPlay = true,
  autoPlayInterval = 5000,
  className = ''
}: ModularHeroSectionProps) {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroImages();
  }, [category]);

  useEffect(() => {
    if (autoPlay && displayMode === 'slideshow' && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, displayMode, images.length, autoPlayInterval]);

  const fetchHeroImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .eq('folder', category)
        .like('file_type', 'image%')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setImages(data || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching hero images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div 
        className={`relative bg-muted animate-pulse ${className}`} 
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground">Loading hero section...</div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div 
        className={`relative bg-gradient-to-br from-glee-columbia/20 to-glee-purple/20 ${className}`} 
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <h2 className="text-2xl font-bold mb-2">No hero images found</h2>
            <p>Add images to the "{category}" folder in the media library</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ height }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentImage.file_url}
          alt={currentImage.title}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/1920x1080?text=Hero+Image";
          }}
        />
        
        {/* Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/40" />
        )}
      </div>

      {/* Content Overlay */}
      {showOverlay && (overlayTitle || overlaySubtitle || currentImage.title) && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {overlayTitle || currentImage.title}
            </h1>
            {(overlaySubtitle || currentImage.description) && (
              <p className="text-xl md:text-2xl text-white/90">
                {overlaySubtitle || currentImage.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Controls for Slideshow */}
      {displayMode === 'slideshow' && images.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                onClick={() => goToImage(index)}
              />
            ))}
          </div>
        </>
      )}

      {/* Image Counter */}
      {displayMode === 'slideshow' && images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
