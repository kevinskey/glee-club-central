
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

  console.log('🎭 HeroSection: Slides data:', { slides: slides.length, isLoading, hasError });

  // Create default slides that will always be shown
  const defaultSlides = [
    {
      id: 'default-1',
      src: '/lovable-uploads/5d6ba7fa-4ea7-42ac-872e-940fb620a273.png',
      alt: 'Spelman College Glee Club',
      title: 'Spelman College Glee Club',
      subtitle: 'To Amaze and Inspire',
      textPosition: 'center' as const,
      textAlignment: 'center' as const,
      isVideo: false,
      priority: true,
      objectFit: 'cover' as const
    },
    {
      id: 'default-2', 
      src: '/lovable-uploads/92a39fc3-43b7-4240-982b-bff85ae2fdca.png',
      alt: 'Glee Club Performance',
      title: 'Experience the Music',
      subtitle: 'Join us for unforgettable performances',
      textPosition: 'center' as const,
      textAlignment: 'center' as const,
      isVideo: false,
      priority: false,
      objectFit: 'cover' as const
    },
    {
      id: 'default-3',
      src: '/lovable-uploads/daf81087-d822-4f6c-9859-43580f9a3971.png', 
      alt: 'Glee Club Members',
      title: 'Our Community',
      subtitle: 'Celebrating excellence in choral music',
      textPosition: 'center' as const,
      textAlignment: 'center' as const,
      isVideo: false,
      priority: false,
      objectFit: 'cover' as const
    }
  ];

  // Always use database slides if available, otherwise use defaults
  const displaySlides = slides.length > 0 ? slides.map((slide, index) => ({
    id: slide.id,
    src: slide.youtube_url || slide.background_image_url || defaultSlides[0].src,
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
    objectFit: 'cover' as const
  })) : defaultSlides;

  console.log('🎭 HeroSection: Display slides:', displaySlides);

  return (
    <section className="w-full bg-gray-900">
      {/* Hero Slides Container with explicit sizing */}
      <div className="w-full h-[60vh] md:h-[70vh] min-h-[400px] max-h-[600px] relative overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MobileOptimizedSlider
            slides={displaySlides}
            aspectRatio="auto"
            autoPlay={true}
            autoPlayInterval={5000}
            showControls={true}
            showIndicators={true}
            preloadAdjacent={true}
            defaultObjectFit="cover"
            className="w-full h-full"
          />
        )}
        
        {/* Admin Edit Button */}
        {isAdmin && (
          <Button
            onClick={() => navigate('/admin/hero-slides')}
            className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
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
