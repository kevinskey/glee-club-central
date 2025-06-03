
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroSlide } from './types';

interface HeroContentProps {
  slide: HeroSlide;
  textSizes: {
    title: string;
    description: string;
  };
  positionClasses: string;
  isMobile: boolean;
}

export function HeroContent({ slide, textSizes, positionClasses, isMobile }: HeroContentProps) {
  const isExternalLink = (url: string) => {
    return url?.startsWith('http://') || url?.startsWith('https://');
  };

  const renderButton = () => {
    if (!slide.button_text || !slide.button_link) return null;

    const buttonClasses = "bg-blue-500 hover:bg-blue-600 text-white w-auto px-6";

    if (isExternalLink(slide.button_link)) {
      return (
        <Button size={isMobile ? "default" : "lg"} className={buttonClasses} asChild>
          <a href={slide.button_link} target="_blank" rel="noopener noreferrer">
            {slide.button_text} <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
      );
    }

    return (
      <Button size={isMobile ? "default" : "lg"} className={buttonClasses} asChild>
        <Link to={slide.button_link}>
          {slide.button_text} <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    );
  };

  // If there's a button link but no button text, make the entire slide clickable
  const hasClickableSlide = slide.button_link && !slide.button_text;
  
  // Check if we have any content to show
  const hasTitle = slide.title && slide.title.trim() !== '';
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

  // If we have content to show, render it normally
  if (hasTitle || hasDescription || hasButton) {
    return (
      <div className={cn(
        "relative z-10 h-full flex px-4 sm:px-6 md:px-8 lg:px-12", 
        positionClasses
      )}>
        <div className="max-w-4xl mx-auto w-full">
          {hasTitle && (
            <h1 className={cn(
              "font-bold text-white mb-2 md:mb-4 leading-tight",
              textSizes.title
            )}>
              {slide.title}
            </h1>
          )}
          {hasDescription && (
            <p className={cn(
              "text-white/90 mb-3 md:mb-6 max-w-2xl leading-relaxed",
              slide.text_alignment === 'center' ? 'mx-auto' : '',
              textSizes.description
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
    );
  }

  // No content and no clickable link - render nothing
  return null;
}
