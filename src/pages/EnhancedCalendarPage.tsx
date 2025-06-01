
import React, { useState } from 'react';
import { EnhancedCalendarView } from '@/components/calendar/EnhancedCalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useUserRole } from '@/hooks/useUserRole';
import { CalendarEvent } from '@/types/calendar';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/page-loader';
import { useIsMobile } from '@/hooks/use-mobile';

export default function EnhancedCalendarPage() {
  const { events, loading, error, fetchEvents } = useCalendarEvents();
  const { userRole, isMember } = useUserRole();
  const { user, loading: authLoading } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [userRSVP, setUserRSVP] = useState<'going' | 'maybe' | 'not_going' | null>(null);
  const isMobile = useIsMobile();

  // Show loading while authentication is being checked
  if (authLoading) {
    return <PageLoader message="Loading calendar..." />;
  }

  const handleEventClick = async (event: CalendarEvent) => {
    setSelectedEvent(event);
    
    if (event.allow_rsvp && user) {
      try {
        // Fetch user's current RSVP status
        const { data } = await supabase
          .from('event_rsvps')
          .select('status')
          .eq('event_id', event.id)
          .eq('user_id', user.id)
          .single();
        
        setUserRSVP(data?.status || null);
      } catch (error) {
        console.error('Error fetching RSVP status:', error);
        setUserRSVP(null);
      }
    }
  };

  const handleRSVP = async (status: 'going' | 'maybe' | 'not_going') => {
    if (!user || !selectedEvent) return;

    try {
      const { error } = await supabase
        .from('event_rsvps')
        .upsert({
          event_id: selectedEvent.id,
          user_id: user.id,
          status,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setUserRSVP(status);
      toast.success('RSVP updated successfully');
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast.error('Failed to update RSVP');
    }
  };

  const handleAddEvent = () => {
    // Future implementation for admin event creation
    toast.info('Event creation coming soon!');
  };

  if (loading) {
    return (
      <div className={`${isMobile ? 'p-4' : 'mobile-container mobile-section-padding'}`}>
        <PageHeader
          title="Calendar"
          description="View upcoming events and performances"
          icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman mx-auto"></div>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isMobile ? 'p-4' : 'mobile-container mobile-section-padding'}`}>
        <PageHeader
          title="Calendar"
          description="View upcoming events and performances"
          icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <div className="flex flex-col items-center justify-center h-48 sm:h-64 space-y-4">
          <div className="text-red-600 text-center">
            <p className="font-semibold text-sm sm:text-base">Error loading calendar</p>
            <p className="text-xs sm:text-sm mt-1">{error}</p>
          </div>
          <Button onClick={fetchEvents} variant="outline" className={`${isMobile ? 'w-full' : 'mobile-touch-target'}`}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'p-4 pb-20' : 'mobile-container mobile-section-padding'} space-y-4 sm:space-y-6 mobile-scroll`}>
      <PageHeader
        title="Calendar"
        description={`View ${isMember ? 'all events and performances' : 'upcoming public events'}`}
        icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
      />

      <EnhancedCalendarView
        events={events}
        onEventClick={handleEventClick}
        onAddEvent={isMember ? handleAddEvent : undefined}
        loading={loading}
      />

      <EventDialog
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        canRSVP={isMember}
        userRSVP={userRSVP}
        onRSVP={handleRSVP}
      />
    </div>
  );
}
