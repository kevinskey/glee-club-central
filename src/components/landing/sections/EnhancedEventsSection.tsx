
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
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

  return (
    <section className="relative -mt-20 pt-20 bg-gradient-to-b from-transparent via-blue-50/30 to-white dark:from-transparent dark:via-blue-900/10 dark:to-background">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Floating Design */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-blue-200/50 dark:border-blue-800/50 mb-4">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Upcoming Performances</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join Us for Musical Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the harmonious blend of tradition and innovation with the Spelman College Glee Club
          </p>
        </div>

        {/* Events Grid with Enhanced Design */}
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {upcomingEvents.map((event, index) => (
              <Card 
                key={event.id} 
                className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden ${
                  index === 0 
                    ? 'lg:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                    : 'bg-white/90 dark:bg-card/90 backdrop-blur-sm hover:bg-white dark:hover:bg-card'
                }`}
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
                      <div className={`w-full h-full flex items-center justify-center ${
                        index === 0 
                          ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20' 
                          : 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20'
                      }`}>
                        <Calendar className={`h-16 w-16 ${
                          index === 0 ? 'text-white/80' : 'text-blue-400'
                        }`} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className={`font-playfair font-bold mb-3 group-hover:scale-105 transition-transform duration-300 ${
                      index === 0 ? 'text-xl text-white' : 'text-lg text-gray-900 dark:text-foreground'
                    }`}>
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className={`h-4 w-4 ${
                          index === 0 ? 'text-blue-200' : 'text-blue-500'
                        }`} />
                        <span className={`text-sm ${
                          index === 0 ? 'text-blue-100' : 'text-muted-foreground'
                        }`}>
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
                          <MapPin className={`h-4 w-4 ${
                            index === 0 ? 'text-blue-200' : 'text-blue-500'
                          }`} />
                          <span className={`text-sm ${
                            index === 0 ? 'text-blue-100' : 'text-muted-foreground'
                          }`}>
                            {event.location}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant={index === 0 ? "secondary" : "outline"}
                      size="sm"
                      className={`group/btn ${
                        index === 0 
                          ? 'bg-white/20 hover:bg-white/30 text-white border-white/30' 
                          : 'hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20'
                      }`}
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
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <Calendar className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground">Stay tuned for our next performances!</p>
          </div>
        )}

        {/* Call to Action with Enhanced Design */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link to="/calendar">
                View Full Calendar
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              asChild
            >
              <Link to="/about">Learn About Us</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-background"></div>
    </section>
  );
}
