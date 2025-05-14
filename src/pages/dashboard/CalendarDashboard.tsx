
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar } from "lucide-react";
import CalendarView from "@/components/dashboard/Calendar";
import MonthlyCalendar from "@/components/dashboard/MonthlyCalendar";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample events data
const mockEvents = [
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
  },
  {
    id: "4",
    title: "HBCU Tour",
    date: new Date(2025, 4, 20),
    time: "All Day",
    location: "Various Locations",
    type: "concert"
  },
  {
    id: "5",
    title: "Alto Sectional",
    date: new Date(2025, 4, 16),
    time: "4:30 PM",
    location: "Practice Room 3",
    type: "sectional"
  }
];

export default function CalendarDashboard() {
  const [events, setEvents] = useState(mockEvents);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Calendar Dashboard"
        description="View upcoming rehearsals, performances and events"
        icon={<Calendar className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="mt-4">
              <CalendarView />
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-4">
              <MonthlyCalendar events={events} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <UpcomingEvents events={events} />
        </div>
      </div>
    </div>
  );
}
