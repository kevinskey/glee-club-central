import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "rehearsal" | "performance" | "social" | "other";
  description: string;
}

// Sample data
const events: Event[] = [
  {
    id: "1",
    title: "Weekly Rehearsal",
    date: "2023-10-25",
    time: "6:00 PM - 8:00 PM",
    location: "Music Building, Room 101",
    type: "rehearsal",
    description: "Regular weekly choir rehearsal. Please bring your Ave Maria and Hallelujah sheet music."
  },
  {
    id: "2",
    title: "Fall Concert",
    date: "2023-11-15",
    time: "7:30 PM - 9:30 PM",
    location: "University Auditorium",
    type: "performance",
    description: "Annual fall concert. Formal attire required. Call time is 6:00 PM."
  },
  {
    id: "3",
    title: "Choir Social",
    date: "2023-10-28",
    time: "7:00 PM - 10:00 PM",
    location: "Student Union",
    type: "social",
    description: "End of month social gathering. Food and drinks provided."
  },
];

export default function SchedulePage() {
  const { user, userProfile } = useAuth();
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "rehearsal":
        return "bg-blue-500 hover:bg-blue-600";
      case "performance":
        return "bg-red-500 hover:bg-red-600";
      case "social":
        return "bg-green-500 hover:bg-green-600";
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
          user?.role === "administrator" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Schedule of rehearsals, performances, and social events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {events.map((event) => (
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
                        <span>{event.date}</span>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
