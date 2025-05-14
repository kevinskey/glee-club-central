
import React, { useEffect } from 'react';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { updateHeroImageWithEvents } from '@/utils/heroImageUtils';

/**
 * This component handles synchronizing calendar events with hero images.
 * It's meant to be placed on the landing page to ensure hero images
 * reflect the latest calendar events.
 */
export const HeroCalendarSync: React.FC = () => {
  const { events, fetchEvents } = useCalendarStore();
  
  useEffect(() => {
    const loadEventsAndUpdateHero = async () => {
      try {
        // First load all calendar events
        await fetchEvents();
        
        // Then update hero images with these events
        if (events.length > 0) {
          await updateHeroImageWithEvents(events);
        }
      } catch (error) {
        console.error("Error syncing calendar events with hero:", error);
      }
    };
    
    loadEventsAndUpdateHero();
  }, []);
  
  // This is a utility component that doesn't render anything
  return null;
};
