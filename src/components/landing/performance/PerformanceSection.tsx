import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { PerformanceEvent } from "./PerformanceEvent";
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
    image: "/images/events/spring_concert.jpg"
  },
  {
    id: "2",
    title: "Alumni Weekend Performance",
    date: "April 20, 2024",
    location: "Tapley Hall, Spelman College",
    description: "A special performance for Spelman alumni during Alumni Weekend.",
    image: "/images/events/alumni_weekend.jpg"
  },
  {
    id: "3",
    title: "Holiday Concert",
    date: "December 5, 2024",
    location: "Sisters Chapel, Spelman College",
    description: "Celebrate the holidays with a festive concert featuring classic and contemporary holiday music.",
    image: "/images/events/holiday_concert.jpg"
  }
];

export function PerformanceSection() {
  const [visibleEvents, setVisibleEvents] = useState(2);

  // Get the authenticated user
  const { isAuthenticated, profile } = useAuth();
  
  const loadMore = () => {
    setVisibleEvents(prevVisibleEvents => prevVisibleEvents + 2);
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
            <PerformanceEvent key={event.id} event={event} />
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
