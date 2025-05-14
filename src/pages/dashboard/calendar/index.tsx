
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Calendar from "@/components/dashboard/Calendar";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Example events - in a real app, these would come from your API or database
  const events = [
    { 
      id: "1", 
      title: "Spring Concert", 
      date: new Date(2025, 4, 17), 
      time: "7:00 PM",
      location: "Sisters Chapel",
      type: "concert"
    },
    { 
      id: "2", 
      title: "Rehearsal", 
      date: new Date(2025, 4, 14), 
      time: "5:00 PM",
      location: "Fine Arts Building",
      type: "rehearsal"
    },
    {
      id: "3",
      title: "Soprano Sectional",
      date: new Date(2025, 4, 15),
      time: "4:30 PM",
      location: "Practice Room 2",
      type: "sectional"
    }
  ];

  // Current date for calendar
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  
  // Handlers for month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prevYear => prevYear - 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prevYear => prevYear + 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
  };
  
  // Get events for the selected date
  const eventsForSelectedDate = date ? events.filter(event => 
    event.date.getFullYear() === date.getFullYear() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getDate() === date.getDate()
  ) : [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Glee Club Calendar"
        description="View upcoming rehearsals, performances and events"
        icon={<CalendarIcon className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar widget */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              month={currentMonth} 
              year={currentYear}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              events={events}
            />
          </CardContent>
        </Card>
        
        {/* Events for selected date */}
        <Card>
          <CardHeader>
            <CardTitle>
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <p className="text-muted-foreground">No events scheduled for this date</p>
            ) : (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.time} • {event.location}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          event.type === "concert" ? "default" : 
                          event.type === "rehearsal" ? "secondary" :
                          "outline"
                        }
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button className="w-full" variant="outline">
                View All Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
