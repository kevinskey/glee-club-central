
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
    console.log('🎭 Hero: No current slide, showing fallback background');
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-glee-spelman via-glee-columbia to-glee-purple">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    );
  }

  console.log('🎭 Hero: Current slide:', currentSlide);
  console.log('🎭 Hero: Available media files:', mediaFiles.map(m => ({ id: m.id, url: m.file_url, title: m.title })));
  console.log('🎭 Hero: Looking for media with ID:', currentSlide.media_id);
  
  // Handle YouTube embeds
  if (currentSlide.media_id && isYouTubeEmbed(currentSlide.media_id)) {
    console.log('🎭 Hero: Rendering YouTube embed:', currentSlide.media_id);
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

  // Find the media file
  const currentMedia = currentSlide.media_id ? mediaFiles.find(m => m.id === currentSlide.media_id) : null;
  
  console.log('🎭 Hero: Found media:', currentMedia);
  
  if (currentMedia && currentMedia.file_url) {
    console.log('🎭 Hero: Rendering media with URL:', currentMedia.file_url);
    console.log('🎭 Hero: Media type:', currentSlide.media_type);
    console.log('🎭 Hero: File type:', currentMedia.file_type);
    
    return currentSlide.media_type === 'video' || currentMedia.file_type?.startsWith('video/') ? (
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
        onLoadStart={() => {
          console.log('🎭 Hero: Video started loading:', currentMedia.file_url);
        }}
        onCanPlay={() => {
          console.log('🎭 Hero: Video can play:', currentMedia.file_url);
        }}
        onError={(e) => {
          console.error('🎭 Hero: Video failed to load:', currentMedia.file_url);
          console.error('🎭 Hero: Video error details:', e);
        }}
      />
    ) : (
      <img
        key={currentMedia.id}
        src={currentMedia.file_url}
        alt={currentMedia.title || 'Hero image'}
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          getAnimationClass()
        )}
        onLoad={() => {
          console.log('🎭 Hero: Image loaded successfully:', currentMedia.file_url);
        }}
        onError={(e) => {
          console.error('🎭 Hero: Image failed to load:', currentMedia.file_url);
          console.error('🎭 Hero: Error details:', e);
          console.error('🎭 Hero: Image element:', e.target);
        }}
      />
    );
  }

  console.log('🎭 Hero: No media found or no file URL, using fallback background');
  console.log('🎭 Hero: Media ID:', currentSlide.media_id);
  console.log('🎭 Hero: Media files count:', mediaFiles.length);

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
