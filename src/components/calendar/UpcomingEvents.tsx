
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Calendar as CalendarIcon, Clock } from "lucide-react";
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
      <div className="w-full py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-glee-purple"></div>
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

      {events.length === 0 ? (
        <Card className="overflow-hidden border-dashed border-2 bg-muted/30">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Stay tuned! The Spelman College Glee Club will announce their next performances soon.
            </p>
            <Link to="/calendar">
              <Button variant="outline" className="border-glee-purple text-glee-purple hover:bg-glee-purple hover:text-white">
                Check Full Calendar
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="h-36 bg-muted relative">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-glee-purple/20 to-glee-purple/10 flex items-center justify-center">
                    <CalendarIcon className="h-12 w-12 text-glee-purple/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-lg font-semibold text-white truncate">{event.title}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CalendarIcon className="h-4 w-4 text-glee-purple mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-glee-purple mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{event.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  <Link to={`/calendar?event=${event.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2 border-glee-purple text-glee-purple hover:bg-glee-purple hover:text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
