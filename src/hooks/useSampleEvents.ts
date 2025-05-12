
// Sample events hook to provide fallback data
import { CalendarEvent, EventType } from "./useCalendarEvents";

export function useSampleEvents() {
  // Sample/fallback events
  const getSampleEvents = (): CalendarEvent[] => {
    const now = new Date();
    return [
      {
        id: "1",
        title: "Fall Showcase",
        date: new Date(2025, 5, 15),
        start: new Date(2025, 5, 15),
        end: new Date(2025, 5, 15),
        time: "7:00 PM - 9:00 PM",
        location: "Sisters Chapel",
        description: "Our annual showcase featuring classical and contemporary pieces.",
        type: "concert" as EventType,
        image_url: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
      },
      {
        id: "2",
        title: "Holiday Concert",
        date: new Date(2025, 11, 10),
        start: new Date(2025, 11, 10),
        end: new Date(2025, 11, 10),
        time: "8:00 PM - 10:00 PM",
        location: "Atlanta Symphony Hall",
        description: "Celebrating the season with festive music and traditional carols.",
        type: "concert" as EventType,
        image_url: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
      },
      {
        id: "3",
        title: "Spring Tour",
        date: new Date(2026, 2, 5),
        start: new Date(2026, 2, 5),
        end: new Date(2026, 2, 15),
        time: "Various Times",
        location: "Various Venues",
        description: "Our annual tour across the southeastern United States.",
        type: "tour" as EventType,
        image_url: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
      },
      {
        id: "4",
        title: "Commencement Performance",
        date: new Date(2026, 4, 20),
        start: new Date(2026, 4, 20),
        end: new Date(2026, 4, 20),
        time: "10:00 AM - 11:30 AM",
        location: "Spelman College Oval",
        description: "Special performance for the graduating class of 2026.",
        type: "special" as EventType,
        image_url: "/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png"
      },
      {
        id: "5",
        title: "Weekly Rehearsal",
        date: new Date(2025, 5, 8),
        start: new Date(2025, 5, 8),
        end: new Date(2025, 5, 8),
        time: "6:00 PM - 8:00 PM",
        location: "Music Building, Room 101",
        description: "Regular weekly choir rehearsal.",
        type: "rehearsal" as EventType
      },
      {
        id: "6",
        title: "Weekly Rehearsal",
        date: new Date(2025, 5, 22),
        start: new Date(2025, 5, 22),
        end: new Date(2025, 5, 22),
        time: "6:00 PM - 8:00 PM",
        location: "Music Building, Room 101",
        description: "Regular weekly choir rehearsal.",
        type: "rehearsal" as EventType
      }
    ];
  };

  return {
    getSampleEvents
  };
}
