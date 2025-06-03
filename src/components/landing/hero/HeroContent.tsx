
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

  return (
    <div className={cn(
      "relative z-10 h-full flex px-4 sm:px-6 md:px-8 lg:px-12", 
      positionClasses
    )}>
      <div className="max-w-4xl mx-auto w-full">
        <h1 className={cn(
          "font-bold text-white mb-2 md:mb-4 leading-tight",
          textSizes.title
        )}>
          {slide.title}
        </h1>
        <p className={cn(
          "text-white/90 mb-3 md:mb-6 max-w-2xl leading-relaxed",
          slide.text_alignment === 'center' ? 'mx-auto' : '',
          textSizes.description
        )}>
          {slide.description}
        </p>
        <div className={cn(
          "flex gap-3",
          slide.text_alignment === 'center' ? 'justify-center' : '',
          slide.text_alignment === 'right' ? 'justify-end' : '',
          isMobile ? 'flex-col sm:flex-row items-center' : 'flex-row items-center'
        )}>
          {renderButton()}
        </div>
      </div>
    </div>
  );
}
