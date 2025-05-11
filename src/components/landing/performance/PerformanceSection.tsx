
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PerformanceEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  type?: string;
}

export function PerformanceSection() {
  const [visibleEvents, setVisibleEvents] = useState(2);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<PerformanceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the authenticated user
  const { isAuthenticated, profile } = useAuth();
  
  // Fetch upcoming performance events from the calendar
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        
        // Get current date in YYYY-MM-DD format for the query
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch upcoming concert events from Supabase
        const { data, error } = await supabase
          .from("calendar_events")
          .select("*")
          .gte("date", today)
          .eq("type", "concert") // Filter to only show concert type events
          .order("date", { ascending: true })
          .limit(6); // Limit to a reasonable number of events
        
        if (error) {
          console.error("Error fetching upcoming events:", error);
          toast.error("Failed to load upcoming performances");
          return;
        }
        
        // Transform the data format
        if (data) {
          const formattedEvents = data.map(event => ({
            id: event.id,
            title: event.title,
            date: new Date(event.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            location: event.location,
            description: event.description || "Join us for this special performance.",
            image: event.image_url || "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png", // Default image if none provided
            type: event.type
          }));
          
          setEvents(formattedEvents);
        }
      } catch (err) {
        console.error("Error in fetchUpcomingEvents:", err);
        toast.error("Failed to load upcoming performances");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUpcomingEvents();
  }, []);
  
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
          </div>
          
          {isAuthenticated && profile?.role === 'admin' && (
            <Link to="/calendar">
              <Button className="mt-4 md:mt-0">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-glee-purple"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No upcoming performances scheduled at this time.</p>
            <p className="mt-2 text-gray-500">Check back soon for our upcoming events!</p>
          </div>
        ) : (
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
        )}

        {events.length > visibleEvents && (
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
