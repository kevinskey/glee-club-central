
import React, { useEffect } from 'react';
import { updateHeroImageWithEvents } from '@/utils/heroImageUtils';
import { supabase } from '@/integrations/supabase/client';

export function HeroCalendarSync() {
  useEffect(() => {
    async function syncHeroImagesWithCalendar() {
      try {
        // Fetch recent/upcoming events that have images
        const { data: events, error } = await supabase
          .from('calendar_events')
          .select('*')
          .not('image_url', 'is', null)
          .order('date', { ascending: true });
          
        if (error) throw error;
        
        if (events && events.length > 0) {
          await updateHeroImageWithEvents(events);
        }
      } catch (error) {
        console.error("Error syncing hero images with calendar:", error);
      }
    }
    
    // Run once on component mount
    syncHeroImagesWithCalendar();
    
    // Set up interval to check for updates (every 12 hours)
    const intervalId = setInterval(() => {
      syncHeroImagesWithCalendar();
    }, 12 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // This component doesn't render anything, just runs the sync logic
  return null;
}
