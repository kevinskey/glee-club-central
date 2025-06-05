
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  isPublic?: boolean;
}

interface EnhancedEventsSectionProps {
  events: Event[];
}

export function EnhancedEventsSection({ events }: EnhancedEventsSectionProps) {
  // Transform events to ensure proper property mapping
  const transformedEvents = events.map(event => ({
    ...event,
    imageUrl: event.imageUrl || (event as any).feature_image_url,
    location: event.location || (event as any).location_name,
    date: event.date || (event as any).start_time
  }));

  const upcomingEvents = transformedEvents.slice(0, 6);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check scroll position for desktop scroller
  const checkScrollButtons = () => {
    if (sliderRef.current && !isMobile) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      return () => slider.removeEventListener('scroll', checkScrollButtons);
    }
  }, [isMobile, upcomingEvents]);

  // Handle touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < upcomingEvents.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % upcomingEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
  };

  // Desktop scroll functions
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const renderEventCard = (event: Event, index: number) => (
    <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white/90 dark:bg-card/90 backdrop-blur-sm hover:bg-white dark:hover:bg-card h-full relative flex-shrink-0 w-80">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="aspect-[16/10] relative overflow-hidden flex-shrink-0">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
              <Calendar className="h-16 w-16 text-blue-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between min-h-0 relative z-10">
          <div className="flex-1">
            <h3 className="font-playfair font-bold mb-3 px-2 py-1 group-hover:scale-105 transition-transform duration-300 text-lg md:text-xl text-gray-900 dark:text-foreground line-clamp-2 leading-tight">
              {event.title}
            </h3>
            
            <div className="space-y-2 mb-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm md:text-base text-muted-foreground truncate">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm md:text-base text-muted-foreground line-clamp-1">
                    {event.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="group/btn hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 self-start relative z-10"
            asChild
          >
            <Link to="/calendar">
              Swipe for More Dates
              <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMobileEventCard = (event: Event, index: number) => (
    <div className="w-full h-[35vh] relative overflow-hidden">
      {/* Image Background - fills entire card */}
      <div className="absolute inset-0 w-full h-full">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
            <Calendar className="h-16 w-16 text-blue-400" />
          </div>
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content overlay - centered in the compact space */}
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 p-4 text-white">
        <div className="space-y-3 text-center">
          <h3 className="font-playfair font-bold text-2xl leading-tight">
            {event.title}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4 text-white flex-shrink-0" />
              <span className="text-white/90 text-base">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {event.location && (
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-white flex-shrink-0" />
                <span className="text-white/90 text-base">
                  {event.location}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative bg-gradient-to-b from-transparent via-blue-50/30 to-white dark:from-transparent dark:via-blue-900/10 dark:to-background py-6 md:py-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full relative z-10">
        {/* Events Display */}
        {upcomingEvents.length > 0 ? (
          <>
            {/* Mobile: Fullscreen cards with swipe */}
            <div className="block md:hidden">
              <div className="relative w-full overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-out w-full"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {upcomingEvents.map((event, index) => (
                    <div 
                      key={event.id} 
                      className="flex-shrink-0 w-full"
                    >
                      {renderMobileEventCard(event, index)}
                    </div>
                  ))}
                </div>
                
                {/* Mobile navigation dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  {upcomingEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Mobile navigation arrows */}
                {upcomingEvents.length > 1 && (
                  <>
                    {currentSlide > 0 && (
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    )}
                    
                    {currentSlide < upcomingEvents.length - 1 && (
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Desktop: Horizontal scrolling row */}
            <div className="hidden md:block mb-6 relative">
              <div className="container mx-auto px-6 lg:px-8">
                {/* Scroll navigation arrows */}
                {canScrollLeft && (
                  <button
                    onClick={scrollLeft}
                    className="absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-black/90 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                
                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-black/90 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-black transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}

                <div 
                  ref={sliderRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    scrollSnapType: 'x mandatory'
                  }}
                >
                  {upcomingEvents.map((event, index) => (
                    <div 
                      key={event.id} 
                      className="h-[400px]"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      {renderEventCard(event, index)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <Calendar className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground">Stay tuned for our next performances!</p>
          </div>
        )}

        {/* Call to Action with Enhanced Design - Restored View Full Calendar button */}
        <div className="text-center pt-4 px-4">
        </div>
      </div>

      {/* Subtle bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-background"></div>
    </section>
  );
}
