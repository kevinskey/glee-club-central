
import React, { useEffect, useState } from "react";
import { PerformanceEvent } from "@/utils/performanceSync";
import { getPerformanceEvents } from "@/utils/performanceSync";
import { PerformanceEvent as EventComponent } from "./PerformanceEvent";

export const PerformanceSection: React.FC = () => {
  const [performances, setPerformances] = useState<PerformanceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        // Get performance events from our synchronization utility
        const events = await getPerformanceEvents();
        
        // Convert from CalendarEvent to PerformanceEvent format
        const performanceEvents: PerformanceEvent[] = events.map(event => ({
          id: event.id,
          title: event.title,
          date: event.start,
          location: event.location,
          description: event.description,
          imageUrl: event.image_url,
        }));
        
        setPerformances(performanceEvents);
      } catch (error) {
        console.error("Error fetching performances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformances();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Performances</h2>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (performances.length === 0) {
    return null; // Don't show the section if there are no performances
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Performances</h2>
        <div className="space-y-6">
          {performances.map((performance) => (
            <EventComponent key={performance.id} event={performance} />
          ))}
        </div>
      </div>
    </div>
  );
};
