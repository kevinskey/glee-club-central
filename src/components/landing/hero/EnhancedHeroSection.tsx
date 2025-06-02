
import React, { useState, useEffect } from "react";
import { HeroContent } from "@/components/landing/hero/HeroContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { BackgroundSlideshow } from "@/components/landing/slideshow/BackgroundSlideshow";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface HeroSlide {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  position: number;
}

export function EnhancedHeroSection() {
  const isMobile = useIsMobile();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const fetchHeroSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSlides(data);
      } else {
        // Fallback to default slide if no slides configured
        setSlides([{
          id: 'default',
          image_url: '/lovable-uploads/92a39fc3-43b7-4240-982b-bff85ae2fdca.png',
          title: 'Spelman College Glee Club',
          subtitle: 'A distinguished ensemble with a rich heritage of musical excellence',
          button_text: 'Upcoming Performances',
          button_link: '/events',
          secondary_button_text: 'Press Kit',
          secondary_button_link: '/press-kit',
          position: 0
        }]);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      // Use fallback slide on error
      setSlides([{
        id: 'fallback',
        image_url: '/lovable-uploads/92a39fc3-43b7-4240-982b-bff85ae2fdca.png',
        title: 'Spelman College Glee Club',
        subtitle: 'A distinguished ensemble with a rich heritage of musical excellence',
        button_text: 'Upcoming Performances',
        button_link: '/events',
        secondary_button_text: 'Press Kit',
        secondary_button_link: '/press-kit',
        position: 0
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const isExternalLink = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const renderButton = (text: string, link: string, variant: 'default' | 'outline' = 'default') => {
    if (!text || !link) return null;

    const buttonClasses = variant === 'default' 
      ? "bg-indigo-500 hover:bg-indigo-600 text-white w-auto px-6"
      : "bg-background/20 backdrop-blur border-white/40 text-white hover:bg-background/30 w-auto px-6";

    if (isExternalLink(link)) {
      return (
        <Button size={isMobile ? "default" : "lg"} variant={variant} className={buttonClasses} asChild>
          <a href={link} target="_blank" rel="noopener noreferrer">
            {text} {variant === 'default' && <ChevronRight className="h-4 w-4 ml-1" />}
          </a>
        </Button>
      );
    }

    return (
      <Button size={isMobile ? "default" : "lg"} variant={variant} className={buttonClasses} asChild>
        <Link to={link}>
          {text} {variant === 'default' && <ChevronRight className="h-4 w-4 ml-1" />}
        </Link>
      </Button>
    );
  };

  if (isLoading) {
    return (
      <section className="relative w-full overflow-hidden m-0 p-0" style={{ height: isMobile ? '40vh' : '60vh' }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden m-0 p-0" style={{ height: isMobile ? '40vh' : '60vh' }}>
      {/* Background Image */}
      <BackgroundSlideshow 
        images={[currentSlideData.image_url]} 
        overlayOpacity={0.6} 
      />
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center m-0 p-0">
        <div className="w-full text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className={cn(
              "font-bold text-white mb-3 leading-tight",
              isMobile ? "text-xl sm:text-2xl" : "text-3xl md:text-4xl lg:text-5xl"
            )}>
              {currentSlideData.title}
            </h1>
            <p className={cn(
              "text-white/90 mb-4 max-w-2xl mx-auto",
              isMobile ? "text-sm sm:text-base" : "text-base md:text-lg lg:text-xl"
            )}>
              {currentSlideData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {renderButton(currentSlideData.button_text, currentSlideData.button_link)}
              {currentSlideData.secondary_button_text && currentSlideData.secondary_button_link && 
                renderButton(currentSlideData.secondary_button_text, currentSlideData.secondary_button_link, 'outline')
              }
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls (only show if multiple slides) */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          {!isMobile && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
                onClick={goToPrevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 z-20"
                onClick={goToNextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentSlide 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/70"
                )}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
            {currentSlide + 1} / {slides.length}
          </div>
        </>
      )}
    </section>
  );
}
