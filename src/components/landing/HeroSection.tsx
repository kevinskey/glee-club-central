
import React from 'react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { MobileOptimizedSlider } from '@/components/ui/mobile-optimized-slider';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function HeroSection() {
  const { slides, isLoading, hasError } = useHeroSlides();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const isAdmin = profile?.role === 'admin' || profile?.is_super_admin;

  // Show loading state while fetching
  if (isLoading) {
    return (
      <section className="py-4 md:py-6">
        <div className="w-full h-[40vh] md:h-[50vh] min-h-[250px] md:min-h-[350px] max-h-[400px] md:max-h-[500px] bg-muted animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  // Show default state if error or no slides
  if (hasError || slides.length === 0) {
    return (
      <section className="py-4 md:py-6">
        <div className="w-full h-[40vh] md:h-[50vh] min-h-[250px] md:min-h-[350px] max-h-[400px] md:max-h-[500px] bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center relative">
          <div className="text-center text-white p-4 max-w-xs md:max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
              Spelman College Glee Club
            </h1>
            <p className="text-sm md:text-lg opacity-90 drop-shadow-md">
              To Amaze and Inspire
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => navigate('/admin/hero-slides')}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border border-white/30"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Slides
            </Button>
          )}
        </div>
      </section>
    );
  }

  // Transform hero slides data for MobileOptimizedSlider with contain object-fit
  const optimizedSlides = slides.map((slide, index) => ({
    id: slide.id,
    src: slide.youtube_url || slide.background_image_url || '/placeholder-hero.jpg',
    srcSet: slide.background_image_url && !slide.youtube_url ? 
      `${slide.background_image_url}?w=600&h=400&fit=crop&crop=center 600w, ${slide.background_image_url}?w=1200&h=800&fit=crop&crop=center 1200w` : 
      undefined,
    alt: slide.title,
    title: slide.title,
    subtitle: slide.description,
    buttonText: slide.button_text,
    link: slide.button_link,
    textPosition: slide.text_position,
    textAlignment: slide.text_alignment,
    isVideo: slide.media_type === 'video' || !!slide.youtube_url,
    priority: index === 0,
    objectFit: 'contain' as const
  }));

  return (
    <section className="w-full">
      <div className="w-full relative">
        <MobileOptimizedSlider
          slides={optimizedSlides}
          aspectRatio="auto"
          autoPlay={true}
          autoPlayInterval={5000}
          showControls={false}
          showIndicators={false}
          preloadAdjacent={true}
          defaultObjectFit="contain"
          className="h-[40vh] md:h-[50vh] min-h-[250px] md:min-h-[350px] max-h-[400px] md:max-h-[500px] w-full"
        />
        
        {/* Admin Edit Button */}
        {isAdmin && (
          <Button
            onClick={() => navigate('/admin/hero-slides')}
            className="absolute top-4 right-4 z-40 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Slides
          </Button>
        )}
      </div>
    </section>
  );
}
