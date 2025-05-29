
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Clock, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useConcertEvents } from '@/hooks/useConcertEvents';

export function ConcertsScroller() {
  const { concerts, loading, error } = useConcertEvents();

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-white to-glee-purple/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-glee-purple mb-4">
              Upcoming Concerts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the beauty and power of our performances throughout the year
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-gray-600">Loading concerts...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-white to-glee-purple/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-glee-purple mb-4">
              Upcoming Concerts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the beauty and power of our performances throughout the year
            </p>
          </div>
          <div className="text-center text-red-600">
            Unable to load concerts at this time.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white to-glee-purple/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-glee-purple mb-4">
            Upcoming Concerts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the beauty and power of our performances throughout the year
          </p>
        </div>
        
        {concerts.length === 0 ? (
          <div className="text-center">
            <Music className="h-16 w-16 text-glee-purple/40 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Upcoming Concerts</h3>
            <p className="text-gray-600">
              Check back soon for exciting performance announcements!
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {concerts.slice(0, 6).map((concert) => (
                <Card key={concert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-glee-purple/20 to-glee-spelman/20 flex items-center justify-center">
                    {concert.feature_image_url ? (
                      <img 
                        src={concert.feature_image_url} 
                        alt={concert.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="h-12 w-12 text-glee-purple/60" />
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl text-glee-purple">
                      {concert.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span>{format(new Date(concert.start_time), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{format(new Date(concert.start_time), 'h:mm a')}</span>
                    </div>
                    
                    {concert.location_name && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{concert.location_name}</span>
                      </div>
                    )}
                    
                    {concert.short_description && (
                      <p className="text-gray-700 text-sm">
                        {concert.short_description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/calendar">
                <Button size="lg" className="bg-glee-spelman hover:bg-glee-spelman/90">
                  View All Events
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
