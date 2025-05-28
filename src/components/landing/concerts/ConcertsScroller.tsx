
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Clock, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample concerts data since calendar functionality is removed
const sampleConcerts = [
  {
    id: '1',
    title: 'Spring Gala Concert',
    date: '2024-04-15',
    time: '7:00 PM',
    location: 'Sisters Chapel, Spelman College',
    description: 'Our annual spring showcase featuring classical and contemporary pieces.',
    image_url: '/lovable-uploads/spelman-concert-1.jpg'
  },
  {
    id: '2',
    title: 'Homecoming Performance',
    date: '2024-10-20',
    time: '6:30 PM',
    location: 'Manley College Center',
    description: 'Celebrating Spelman traditions with beloved alumni favorites.',
    image_url: '/lovable-uploads/spelman-concert-2.jpg'
  },
  {
    id: '3',
    title: 'Holiday Concert',
    date: '2024-12-10',
    time: '7:30 PM',
    location: 'Sisters Chapel, Spelman College',
    description: 'Festive holiday melodies to celebrate the season.',
    image_url: '/lovable-uploads/spelman-concert-3.jpg'
  }
];

export function ConcertsScroller() {
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sampleConcerts.map((concert) => (
            <Card key={concert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-glee-purple/20 to-glee-spelman/20 flex items-center justify-center">
                <Music className="h-12 w-12 text-glee-purple/60" />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-glee-purple">
                  {concert.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>{new Date(concert.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{concert.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{concert.location}</span>
                </div>
                
                <p className="text-gray-700 text-sm">
                  {concert.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/contact">
            <Button size="lg" className="bg-glee-spelman hover:bg-glee-spelman/90">
              Get Performance Updates
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
