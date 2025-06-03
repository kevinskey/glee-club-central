
import React from 'react';
import { cn } from '@/lib/utils';
import { HeroSlide, MediaFile, HeroSettings } from './types';

interface HeroBackgroundMediaProps {
  currentSlide: HeroSlide | null;
  mediaFiles: MediaFile[];
  settings: HeroSettings | null;
}

export function HeroBackgroundMedia({ currentSlide, mediaFiles, settings }: HeroBackgroundMediaProps) {
  const isYouTubeEmbed = (url: string) => {
    return url?.includes('youtube.com/embed/');
  };

  const getAnimationClass = () => {
    if (!settings?.animation_style || settings.animation_style === 'none') return '';
    
    switch (settings.animation_style) {
      case 'fade':
        return 'transition-opacity duration-1000';
      case 'slide':
        return 'transition-transform duration-700 ease-in-out';
      case 'zoom':
        return 'transition-transform duration-1000 ease-in-out';
      default:
        return '';
    }
  };

  if (!currentSlide) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    );
  }

  console.log('🎭 Hero: Rendering background for slide:', currentSlide);
  
  if (currentSlide.media_id && isYouTubeEmbed(currentSlide.media_id)) {
    return (
      <iframe
        key={currentSlide.id}
        src={currentSlide.media_id}
        className={cn(
          "absolute inset-0 w-full h-full pointer-events-none object-cover",
          getAnimationClass()
        )}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }

  const currentMedia = currentSlide.media_id ? mediaFiles.find(m => m.id === currentSlide.media_id) : null;
  
  if (currentMedia && currentMedia.file_url) {
    return currentSlide.media_type === 'video' ? (
      <video
        key={currentMedia.id}
        src={currentMedia.file_url}
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          getAnimationClass()
        )}
        autoPlay
        muted
        loop
        playsInline
        style={{ aspectRatio: '16/9' }}
      />
    ) : (
      <img
        key={currentMedia.id}
        src={currentMedia.file_url}
        alt={currentMedia.title}
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          getAnimationClass()
        )}
        style={{ aspectRatio: '16/9' }}
      />
    );
  }

  // Default placeholder background with fixed SVG
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
      <div className="absolute inset-0 bg-black/20"></div>
      {/* Default placeholder pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-repeat" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
    </div>
  );
}
