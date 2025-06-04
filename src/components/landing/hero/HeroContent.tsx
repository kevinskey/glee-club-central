
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroSlide, MediaFile } from './types';

interface HeroContentProps {
  slide: HeroSlide;
  textSizes: {
    title: string;
    description: string;
  };
  positionClasses: string;
  isMobile: boolean;
  mediaFiles: MediaFile[];
}

export function HeroContent({ slide, textSizes, positionClasses, isMobile, mediaFiles }: HeroContentProps) {
  const isExternalLink = (url: string) => {
    return url?.startsWith('http://') || url?.startsWith('https://');
  };

  const renderButton = () => {
    if (!slide.button_text || !slide.button_link) return null;

    const buttonClasses = "bg-blue-500 hover:bg-blue-600 text-white w-auto px-6";

    // Use the specific Syracuse calendar URL for Learn More buttons
    const buttonLink = slide.button_text.toLowerCase().includes('learn more') 
      ? 'https://calendar.syracuse.edu/events/2025-jun-29/return-to-community-a-sunday-gospel-jazz-service-with-the-spelman-college-glee-club'
      : slide.button_link;

    if (isExternalLink(buttonLink)) {
      return (
        <Button size={isMobile ? "default" : "lg"} className={buttonClasses} asChild>
          <a href={buttonLink} target="_blank" rel="noopener noreferrer">
            {slide.button_text} <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
      );
    }

    return (
      <Button size={isMobile ? "default" : "lg"} className={buttonClasses} asChild>
        <Link to={buttonLink}>
          {slide.button_text} <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    );
  };

  // If there's a button link but no button text, make the entire slide clickable
  const hasClickableSlide = slide.button_link && !slide.button_text;
  
  // Get the current media file to use its title as fallback
  const currentMedia = slide.media_id ? mediaFiles.find(m => m.id === slide.media_id) : null;
  
  // Use slide title if provided, otherwise use media title, otherwise use empty string
  const displayTitle = slide.title && slide.title.trim() !== '' 
    ? slide.title 
    : currentMedia?.title || '';
  
  // Check if we have any content to show
  const hasTitle = displayTitle.trim() !== '';
  const hasDescription = slide.description && slide.description.trim() !== '';
  const hasButton = slide.button_text && slide.button_link;
  
  // If no content and it's clickable, render invisible clickable overlay
  if (!hasTitle && !hasDescription && !hasButton && hasClickableSlide) {
    const linkElement = isExternalLink(slide.button_link) ? (
      <a 
        href={slide.button_link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label="Navigate to linked content"
      />
    ) : (
      <Link 
        to={slide.button_link}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label="Navigate to linked content"
      />
    );
    
    return linkElement;
  }

  // If we have content to show, render it normally with better spacing and visibility
  if (hasTitle || hasDescription || hasButton) {
    return (
      <div className={cn(
        "relative z-10 h-full flex px-6 sm:px-8 md:px-12 lg:px-16", 
        positionClasses
      )}>
        <div className="max-w-6xl mx-auto w-full">
          {/* Add background overlay for better text readability */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 md:p-8 lg:p-10">
            {hasTitle && (
              <h1 className={cn(
                "font-bold text-white mb-4 md:mb-6 leading-tight",
                textSizes.title,
                // Ensure text doesn't overflow
                "break-words hyphens-auto"
              )}>
                {displayTitle}
              </h1>
            )}
            {hasDescription && (
              <p className={cn(
                "text-white/95 mb-6 md:mb-8 max-w-4xl leading-relaxed",
                slide.text_alignment === 'center' ? 'mx-auto' : '',
                textSizes.description,
                // Ensure text doesn't overflow
                "break-words hyphens-auto"
              )}>
                {slide.description}
              </p>
            )}
            {hasButton && (
              <div className={cn(
                "flex gap-3",
                slide.text_alignment === 'center' ? 'justify-center' : '',
                slide.text_alignment === 'right' ? 'justify-end' : '',
                isMobile ? 'flex-col sm:flex-row items-center' : 'flex-row items-center'
              )}>
                {renderButton()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No content and no clickable link - render nothing
  return null;
}
