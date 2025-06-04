
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
  const upcomingEvents = events.slice(0, 3);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || upcomingEvents.length <= 1) return;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || upcomingEvents.length <= 1) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isMobile || upcomingEvents.length <= 1) return;
    
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swiped left - next slide
        goToNext();
      } else {
        // Swiped right - previous slide
        goToPrevious();
      }
    }
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % upcomingEvents.length);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative bg-gradient-to-b from-transparent via-blue-50/30 to-white dark:from-transparent dark:via-blue-900/10 dark:to-background">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Events Grid with Enhanced Design */}
        {upcomingEvents.length > 0 ? (
          <>
            {/* Mobile: Swipeable carousel */}
            <div className="block md:hidden mb-8">
              <div 
                ref={containerRef}
                className="relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-300 ease-out"
                  style={{ 
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${upcomingEvents.length * 100}%`
                  }}
                >
                  {upcomingEvents.map((event, index) => (
                    <div key={event.id} className="w-full flex-shrink-0 px-2">
                      <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white/90 dark:bg-card/90 backdrop-blur-sm hover:bg-white dark:hover:bg-card">
                        <CardContent className="p-0">
                          <div className="aspect-[16/10] relative overflow-hidden">
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
                          
                          <div className="p-6">
                            <h3 className="font-playfair font-bold mb-3 group-hover:scale-105 transition-transform duration-300 text-lg text-gray-900 dark:text-foreground">
                              {event.title}
                            </h3>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="text-sm text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm text-muted-foreground">
                                    {event.location}
                                  </span>
                                </div>
                              )}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="group/btn hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                              asChild
                            >
                              <Link to="/calendar">
                                Learn More
                                <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Navigation arrows for mobile */}
                {upcomingEvents.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-black/80 rounded-full flex items-center justify-center shadow-lg z-10"
                      aria-label="Previous event"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-black/80 rounded-full flex items-center justify-center shadow-lg z-10"
                      aria-label="Next event"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Mobile slide indicators */}
              {upcomingEvents.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {upcomingEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide 
                          ? 'bg-blue-500 dark:bg-blue-400' 
                          : 'bg-blue-300 dark:bg-blue-700'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Equal-sized grid layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {upcomingEvents.map((event, index) => (
                <Card 
                  key={event.id} 
                  className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white/90 dark:bg-card/90 backdrop-blur-sm hover:bg-white dark:hover:bg-card"
                >
                  <CardContent className="p-0">
                    <div className="aspect-[16/10] relative overflow-hidden">
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
                    
                    <div className="p-6">
                      <h3 className="font-playfair font-bold mb-3 group-hover:scale-105 transition-transform duration-300 text-lg text-gray-900 dark:text-foreground">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-muted-foreground">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="group/btn hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                        asChild
                      >
                        <Link to="/calendar">
                          Learn More
                          <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <Calendar className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground">Stay tuned for our next performances!</p>
          </div>
        )}

        {/* Call to Action with Enhanced Design - Centered single button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-glee-columbia via-glee-purple to-glee-columbia hover:from-glee-columbia/90 hover:via-glee-purple/90 hover:to-glee-columbia/90 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link to="/calendar">
              View Full Calendar
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Subtle bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-background"></div>
    </section>
  );
}
