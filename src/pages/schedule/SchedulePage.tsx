
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { EventList } from "@/components/calendar/EventList";
import { useAuth } from "@/contexts/AuthContext";

export default function SchedulePage() {
  const [view, setView] = React.useState<"calendar" | "list">("calendar");
  const { isAuthenticated, profile } = useAuth();
  
  // Check if user is admin
  const isAdmin = profile?.role === "admin";
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Glee Club Schedule"
          description="Rehearsals, performances, and important dates"
          icon={<Calendar className="h-6 w-6" />}
        />
        
        {isAdmin && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        )}
      </div>
      
      <div className="flex flex-col-reverse md:flex-row gap-6">
        <div className={`${view === "calendar" ? "w-full" : "md:w-1/3 w-full"}`}>
          {view === "calendar" ? <CalendarContainer /> : <EventList />}
        </div>
      </div>
    </div>
  );
}
