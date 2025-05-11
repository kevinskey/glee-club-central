
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { CalendarPlus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "Spring Concert",
    date: "May 15, 2024",
    location: "Sisters Chapel, Spelman College",
    description: "Join us for an evening of music celebrating the season of spring.",
    image: "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png"
  },
  {
    id: "2",
    title: "Alumni Weekend Performance",
    date: "April 20, 2024",
    location: "Tapley Hall, Spelman College",
    description: "A special performance for Spelman alumni during Alumni Weekend.",
    image: "/lovable-uploads/e06ff100-0add-4adc-834f-50ef81098d35.png"
  },
  {
    id: "3",
    title: "Holiday Concert",
    date: "December 5, 2024",
    location: "Sisters Chapel, Spelman College",
    description: "Celebrate the holidays with a festive concert featuring classic and contemporary holiday music.",
    image: "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png"
  }
];

export function PerformanceSection() {
  const [visibleEvents, setVisibleEvents] = useState(2);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Get the authenticated user
  const { isAuthenticated, profile } = useAuth();
  
  const loadMore = () => {
    setVisibleEvents(prevVisibleEvents => prevVisibleEvents + 2);
  };

  const handleImageError = (eventId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [eventId]: true
    }));
  };

  return (
    <section id="performances" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Upcoming Performances</h2>
            <p className="text-muted-foreground mt-2">See where the Spelman College Glee Club will be performing</p>
          </div>
          
          {isAuthenticated && profile?.role === 'admin' && (
            <Button className="mt-4 md:mt-0">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, visibleEvents).map(event => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                {!imageErrors[event.id] ? (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => handleImageError(event.id)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground text-sm">{event.title} - Image unavailable</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.date} | {event.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{event.description}</p>
                <Link to="/calendar">
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleEvents < events.length && (
          <div className="text-center mt-8">
            <Button variant="secondary" onClick={loadMore}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
