
import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useUserRole } from '@/hooks/useUserRole';
import { CalendarEvent } from '@/types/calendar';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function CalendarPage() {
  const { events, loading } = useCalendarEvents();
  const { userRole, isMember } = useUserRole();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [userRSVP, setUserRSVP] = useState<'going' | 'maybe' | 'not_going' | null>(null);

  const handleEventClick = async (event: CalendarEvent) => {
    setSelectedEvent(event);
    
    if (event.allow_rsvp && user) {
      // Fetch user's current RSVP status
      const { data } = await supabase
        .from('event_rsvps')
        .select('status')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .single();
      
      setUserRSVP(data?.status || null);
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader
          title="Calendar"
          description="View upcoming events and performances"
          icon={<Calendar className="h-6 w-6" />}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading calendar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Calendar"
        description="View upcoming events and performances"
        icon={<Calendar className="h-6 w-6" />}
      />

      <CalendarView
        events={events}
        onEventClick={handleEventClick}
        showPrivateEvents={isMember}
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
