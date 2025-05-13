
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { fetchUpcomingPerformances, PerformanceEvent } from "@/utils/supabase/calendar";
import { Link } from "react-router-dom";

export function UpcomingEvents() {
  const [events, setEvents] = useState<PerformanceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const performances = await fetchUpcomingPerformances(3); // Get 3 upcoming events
        setEvents(performances);
      } catch (error) {
        console.error("Error loading upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-purple"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-muted-foreground text-lg">No upcoming events scheduled</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-glee-purple" />
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        </div>
        <Link to="/calendar">
          <Button variant="ghost" size="sm" className="text-glee-purple hover:text-glee-purple/90">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="h-32 bg-muted relative">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-lg font-semibold text-white truncate">{event.title}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{event.date}</span>
                  <span className="text-muted-foreground">{event.location}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                <Link to={`/calendar?event=${event.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
