
import React, { useEffect, useState } from "react";
import { getPerformanceEvents } from "@/utils/performanceSync";
import { CalendarEvent } from "@/types/calendar";

// Rename this interface to avoid name clash with the imported type
interface PerformanceEventDisplay {
  id: string;
  title: string;
  date: string | Date;
  location?: string;
  description?: string;
  imageUrl?: string;
}

// Create or update the PerformanceEvent component
const PerformanceEvent: React.FC<{ event: PerformanceEventDisplay }> = ({ event }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
      {event.imageUrl ? (
        <div className="md:w-1/3">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
      ) : null}
      <div className={`p-6 ${event.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-3">{formattedDate}</p>
        {event.location && (
          <p className="text-gray-800 mb-3">
            <strong>Location:</strong> {event.location}
          </p>
        )}
        {event.description && (
          <p className="text-gray-700">{event.description}</p>
        )}
      </div>
    </div>
  );
};

export const PerformanceSection: React.FC = () => {
  const [performances, setPerformances] = useState<PerformanceEventDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        // Get performance events from our synchronization utility
        const events = await getPerformanceEvents();
        
        // Convert from CalendarEvent to PerformanceEvent format
        const performanceEvents: PerformanceEventDisplay[] = events.map(event => ({
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
            <PerformanceEvent key={performance.id} event={performance} />
          ))}
        </div>
      </div>
    </div>
  );
};
