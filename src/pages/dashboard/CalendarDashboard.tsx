
import React, { useState } from 'react';
import { PageHeaderWithToggle } from "@/components/ui/page-header-with-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { MonthlyCalendar } from "@/components/dashboard/Calendar";

// Sample events data
const SAMPLE_EVENTS = [
  {
    date: new Date(2025, 4, 15),
    title: "Weekly Rehearsal",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    time: "6:00 PM - 8:00 PM",
    location: "Music Hall Room 101"
  },
  {
    date: new Date(2025, 4, 18),
    title: "Spring Concert",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    time: "7:30 PM - 9:30 PM",
    location: "Spelman Auditorium"
  },
  {
    date: new Date(2025, 4, 22),
    title: "Weekly Rehearsal",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    time: "6:00 PM - 8:00 PM",
    location: "Music Hall Room 101"
  },
  {
    date: new Date(2025, 4, 25),
    title: "Community Performance",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    time: "2:00 PM - 3:30 PM",
    location: "Downtown Arts Center"
  },
  {
    date: new Date(2025, 4, 29),
    title: "Weekly Rehearsal",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    time: "6:00 PM - 8:00 PM",
    location: "Music Hall Room 101"
  },
  {
    date: new Date(2025, 5, 5),
    title: "Alumni Event",
    color: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    time: "5:00 PM - 7:00 PM",
    location: "Spelman College Alumni Hall"
  }
];

export default function CalendarDashboard() {
  // State for current month and year
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

  // Get upcoming events (next 30 days)
  const upcomingEvents = SAMPLE_EVENTS
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      return eventDate >= today && eventDate <= thirtyDaysLater;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="container mx-auto py-8">
      <PageHeaderWithToggle 
        title="Calendar"
        icon={<CalendarIcon className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <MonthlyCalendar 
            month={currentMonth} 
            year={currentYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            events={SAMPLE_EVENTS}
          />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <div key={index} className="rounded-lg border p-3">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {event.date.toLocaleDateString()}
                        </p>
                        <p className="flex items-center mt-1">
                          <Clock className="mr-2 h-4 w-4" />
                          {event.time}
                        </p>
                        <p className="flex items-center mt-1">
                          <MapPin className="mr-2 h-4 w-4" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No upcoming events</p>
                )}
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Events
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Add Event
              </Button>
              <Button className="w-full" variant="outline">
                View Performance Schedule
              </Button>
              <Button className="w-full" variant="outline">
                Export Calendar (iCal)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
