
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Event } from "@/pages/dashboard/DashboardPage";

interface NextEventCountdownProps {
  event: Event;
}

export const NextEventCountdown: React.FC<NextEventCountdownProps> = ({ event }) => {
  const navigate = useNavigate();
  
  // Calculate days until next event
  const getDaysUntilNextEvent = () => {
    const today = new Date();
    const eventDate = new Date(event.date);
    const diffTime = Math.abs(eventDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysUntilNextEvent = getDaysUntilNextEvent();
  
  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-glee-spelman to-glee-spelman/90 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Next Performance Countdown</span>
          </div>
          <span className="text-2xl font-bold">
            {daysUntilNextEvent} {daysUntilNextEvent === 1 ? 'day' : 'days'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <div className="flex justify-between text-sm text-white/90">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{event.date.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
          </div>
          {event.location && (
            <div className="text-sm flex items-center gap-2 mt-2">
              <span className="font-medium">Location:</span> 
              <span>{event.location}</span>
            </div>
          )}
          <div className="mt-4">
            <Button 
              variant="secondary" 
              onClick={() => navigate("/dashboard/calendar")} 
              className="bg-white text-glee-spelman hover:bg-white/90"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
