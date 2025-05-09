
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCalendarEvents, CalendarEvent } from "@/hooks/useCalendarEvents";
import { GoogleCalendarToggle } from "@/components/calendar/GoogleCalendarToggle";

export default function SchedulePage() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const { events, loading: eventsLoading, useGoogleCalendar, toggleGoogleCalendar } = useCalendarEvents();
  
  // Set loading state based on events loading
  useEffect(() => {
    setLoading(eventsLoading);
  }, [eventsLoading]);
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "rehearsal":
        return "bg-blue-500 hover:bg-blue-600";
      case "concert":
        return "bg-glee-purple hover:bg-glee-purple/90";
      case "tour":
        return "bg-green-500 hover:bg-green-600";
      case "special":
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Update the role comparisons to use "administrator" instead of "admin"
  const isAdmin = userProfile?.role === "administrator";
  const canEdit = userProfile?.role === "administrator" || userProfile?.role === "section_leader";
  
  return (
    <div>
      <PageHeader
        title="Glee Club Schedule"
        description="Upcoming rehearsals, performances, and events"
        icon={<Calendar className="h-6 w-6" />}
        actions={
          <div className="flex items-center gap-3">
            <GoogleCalendarToggle
              useGoogleCalendar={useGoogleCalendar}
              toggleGoogleCalendar={toggleGoogleCalendar}
            />
            {isAdmin && (
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            )}
          </div>
        }
      />

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              {useGoogleCalendar 
                ? "Events from Google Calendar" 
                : "Schedule of rehearsals, performances, and social events"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-purple"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {events.length === 0 ? (
                <p className="text-center text-gray-500">No upcoming events found.</p>
              ) : (
                events.slice(0, 10).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-medium">{event.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(event.date, 'yyyy-MM-dd')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={`${getTypeColor(event.type)} text-white`}
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="mt-4 text-sm">{event.description}</p>
                    {user?.role === "administrator" && (
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                          Cancel Event
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
